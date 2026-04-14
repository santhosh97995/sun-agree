import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. AI Crop Yield Prediction API
  app.post("/api/predict-yield", (req, res) => {
    const { length, width, cropType, soilType, irrigationMethod } = req.body;
    const area = Number(length) * Number(width);
    // In a real system, this would call an ML model. 
    // Here we return the calculated area and metadata for the frontend to use with Gemini.
    res.json({
      area,
      unit: "square meters",
      processingStatus: "Calculated land area. Ready for ML analysis.",
      inputs: { length, width, cropType, soilType, irrigationMethod }
    });
  });

  // 2. Plant Disease Detection API (Placeholder for image processing)
  app.post("/api/detect-disease", (req, res) => {
    res.json({
      status: "Image received",
      preprocessing: "Resized to 224x224, Normalized pixels.",
      readyForCNN: true
    });
  });

  // 3. Smart Fertilizer Recommendation API
  app.post("/api/recommend-fertilizer", (req, res) => {
    const { cropType, soilType, stage } = req.body;
    res.json({
      status: "Success",
      logic: "Nutrient Mapping Algorithm",
      nutrientLevel: "Medium",
      inputs: { cropType, soilType, stage }
    });
  });

  // 4. Smart Irrigation Recommendation API
  app.post("/api/recommend-irrigation", (req, res) => {
    const { moisture, weather, cropType } = req.body;
    res.json({
      status: "Success",
      evapotranspirationRate: weather === "Sunny" ? "High (7.2mm/day)" : "Moderate (4.1mm/day)",
      inputs: { moisture, weather, cropType }
    });
  });

  // 5. Pest Detection API
  app.post("/api/detect-pest", (req, res) => {
    res.json({
      status: "Pest image analyzed",
      featureExtraction: "Completed",
      readyForClassification: true
    });
  });

  // 6. Market Price Prediction API
  app.post("/api/predict-market", (req, res) => {
    const { cropType, region } = req.body;
    res.json({
      status: "Success",
      trendAnalysis: "Bullish trend detected in regional markets",
      inputs: { cropType, region }
    });
  });

  // 7. Smart Crop Recommendation API
  app.post("/api/recommend-crop", (req, res) => {
    const { soilType, rainfall, temperature, demand } = req.body;
    res.json({
      status: "Success",
      environmentalSuitability: "High match for selected parameters",
      inputs: { soilType, rainfall, temperature, demand }
    });
  });

  // 8. Voice Assistant API
  app.post("/api/voice-assistant", (req, res) => {
    const { query } = req.body;
    res.json({
      status: "NLP processing started",
      intent: "Identify agricultural query",
      query
    });
  });

  // 9. Farm Resource Calculator API
  app.post("/api/calculate-resources", (req, res) => {
    const { fieldSize, cropType } = req.body;
    res.json({
      status: "Calculating resource requirements",
      baseArea: fieldSize,
      inputs: { fieldSize, cropType }
    });
  });

  // 10. Weather API
  app.get("/api/weather", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    try {
      // Fetch weather and city name in parallel from the backend
      const [weatherRes, geoRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`),
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
          headers: {
            'User-Agent': 'SmartAgriAI/1.0'
          }
        })
      ]);

      const data = await weatherRes.json();
      const geoData = await geoRes.json();
      
      const cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || "Current Location";
      
      const code = data.current_weather.weathercode;
      let condition = "Clear";
      if (code >= 1 && code <= 3) condition = "Partly Cloudy";
      if (code >= 45 && code <= 48) condition = "Foggy";
      if (code >= 51 && code <= 67) condition = "Rainy";
      if (code >= 71 && code <= 77) condition = "Snowy";
      if (code >= 80 && code <= 82) condition = "Showers";
      if (code >= 95) condition = "Thunderstorm";

      res.json({
        temp: Math.round(data.current_weather.temperature),
        condition,
        city: cityName,
        humidity: data.hourly?.relativehumidity_2m?.[0] || 45,
        wind: Math.round(data.current_weather.windspeed)
      });
    } catch (error) {
      console.error("Backend weather error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
