import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const model = "gemini-3-flash-preview"; // Using a stable flash model for speed

export async function analyzeImage(base64Image: string, prompt: string, language: string = 'en') {
  const finalPrompt = `${prompt}\n\nIMPORTANT: Provide the response strictly in ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}. Use simple, farmer-friendly language.`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: finalPrompt }
        ]
      }
    ]
  });
  return response.text;
}

export async function getFarmingAdvice(prompt: string, systemInstruction?: string, language: string = 'en') {
  const finalSystemInstruction = (systemInstruction || "You are an expert agricultural scientist and farming assistant. Provide practical, accurate, and helpful advice to farmers.") + 
    ` Respond strictly in ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}.`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: finalSystemInstruction
    }
  });
  return response.text;
}

export async function getStructuredAdvice(prompt: string, schema: any, language: string = 'en') {
  const finalPrompt = `${prompt}\n\nIMPORTANT: Provide all text fields in the JSON response strictly in ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}. Use simple, farmer-friendly language.`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: finalPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function predictCropYield(data: any, base64Image?: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = base64Image 
    ? `As a Smart Agriculture AI Assistant, analyze the provided satellite image and the following farm data to predict crop yield and provide farming advice.
       Farmer Input: ${JSON.stringify(data)}
       
       Your job:
       1. Analyze weather patterns, soil suitability, crop data, and market trends.
       2. Predict: Best crop, if selected crop is good, expected yield, and profit.
       3. Give practical suggestions for fertilizer, water, and sowing time.
       4. Use VERY SIMPLE language (like speaking to a farmer). Avoid technical words.
       
       Provide a detailed prediction including yield estimates, key factors, risk factors, and actionable recommendations.
       Also include a 'simpleSummary' field that follows this EXACT format:
       🌾 Best Crop: [Name]
       📊 Crop Status: [Good/Not Good - Expected Yield]
       💰 Profit Chance: [Low/Medium/High]
       📅 Best Time: [Sowing Time]
       💧 Water Advice: [Simple advice]
       🌱 Fertilizer: [Organic + Chemical advice]
       🚀 How to Apply: [Step-by-step simple instructions]
       ⚠️ Warning (if any): [Simple warning]
       
       IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}.`
    : `As a Smart Agriculture AI Assistant, predict the crop yield and provide farming advice based on the following data: ${JSON.stringify(data)}.
       
       Your job:
       1. Analyze weather patterns, soil suitability, crop data, and market trends.
       2. Predict: Best crop, if selected crop is good, expected yield, and profit.
       3. Give practical suggestions for fertilizer, water, and sowing time.
       4. Use VERY SIMPLE language (like speaking to a farmer). Avoid technical words.
       
       Provide a detailed prediction including yield estimates, key factors, risk factors, and actionable recommendations.
       Also include a 'simpleSummary' field that follows this EXACT format:
       🌾 Best Crop: [Name]
       📊 Crop Status: [Good/Not Good - Expected Yield]
       💰 Profit Chance: [Low/Medium/High]
       📅 Best Time: [Sowing Time]
       💧 Water Advice: [Simple advice]
       🌱 Fertilizer: [Organic + Chemical advice]
       🚀 How to Apply: [Step-by-step simple instructions]
       ⚠️ Warning (if any): [Simple warning]
       
       IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      yieldPerHectare: { type: Type.NUMBER, description: "Predicted yield in tons/hectare" },
      totalYield: { type: Type.NUMBER, description: "Predicted total yield for the farm size" },
      waterNeeded: { type: Type.NUMBER, description: "Estimated water needed in Liters/day" },
      riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
      riskReason: { type: Type.STRING, description: "Brief reason for the risk level" },
      fertilizerSuggestion: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          amount: { type: Type.STRING },
          applicationMethod: { type: Type.STRING, description: "How to apply the fertilizer" }
        },
        required: ["type", "amount", "applicationMethod"]
      },
      bestHarvestTime: { type: Type.STRING, description: "Estimated best time to harvest" },
      simpleSummary: { type: Type.STRING, description: "A very simple summary for the farmer following the requested format" },
      applicationSteps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Step-by-step instructions for the farmer to apply the advice"
      },
      keyFactors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "e.g., Location Suitability, Weather, Soil Analysis" },
            details: { type: Type.STRING }
          },
          required: ["category", "details"]
        }
      },
      riskFactors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "e.g., Uneven Rainfall, Pest Risk" },
            details: { type: Type.STRING }
          },
          required: ["category", "details"]
        }
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "e.g., Soil & Nutrients, Water Management" },
            details: { type: Type.STRING }
          },
          required: ["category", "details"]
        }
      },
      satelliteInsights: { 
        type: Type.STRING, 
        description: "Specific insights derived from the satellite image analysis (if provided)" 
      }
    },
    required: ["yieldPerHectare", "totalYield", "waterNeeded", "riskLevel", "riskReason", "fertilizerSuggestion", "bestHarvestTime", "simpleSummary", "keyFactors", "riskFactors", "recommendations"]
  };

  if (base64Image) {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}");
  }

  return getStructuredAdvice(prompt, schema, language);
}

export async function getCombinedFarmPlan(cropName: string, fieldSize: number, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As an AI Agricultural Consultant, create a combined Resource and Budget Plan for:
    Crop: "${cropName}"
    Field Size: ${fieldSize} acres
    
    Your job:
    1. Calculate Resources: Seeds (kg), Fertilizer (kg), and Water (liters) needed for this size.
    2. Create a Budget: Estimate costs for Seeds, Fertilizer, Labor, and Irrigation.
    3. Provide Profit Projection: Estimated total cost vs expected revenue.
    4. Give Efficiency Tips: How to save money and resources.
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}. Use simple, farmer-friendly language.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      resources: {
        type: Type.OBJECT,
        properties: {
          seeds: { type: Type.STRING },
          fertilizer: { type: Type.STRING },
          water: { type: Type.STRING }
        },
        required: ["seeds", "fertilizer", "water"]
      },
      budget: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            cost: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["item", "cost", "description"]
        }
      },
      totalEstimatedCost: { type: Type.NUMBER },
      expectedRevenue: { type: Type.STRING },
      profitProjection: { type: Type.STRING },
      efficiencyTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      summary: { type: Type.STRING }
    },
    required: ["resources", "budget", "totalEstimatedCost", "expectedRevenue", "profitProjection", "efficiencyTips", "summary"]
  };

  return getStructuredAdvice(prompt, schema, language);
}

export async function getFarmerWellnessAdvice(language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As an AI Health & Agricultural Wellness Expert, provide a comprehensive wellness guide for farmers.
    Your guide must include:
    1. A detailed Daily Timetable (Morning, Afternoon, Evening, Night) optimized for productivity and health.
    2. Health & Safety Guidance covering:
       - Heat Stress & Hydration (How to stay cool and hydrated)
       - Skin Protection (Sun protection and chemical safety)
       - Muscle & Joint Care (Ergonomics, lifting techniques, and stretches)
       - Mental Health (Stress management and community support)
       - Nutrition (Healthy diet for physical labor)
    3. Practical Solutions to Common Farming Problems (Pests, Weather, Water, Market prices).
    4. Specific Health Tips & Suggestions:
       - 5 Daily Health Tips (Short, actionable advice)
       - 3 Safety Suggestions for handling tools and chemicals.
    
    Use simple, practical, and farmer-friendly language. Avoid technical jargon.
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      timetable: {
        type: Type.OBJECT,
        properties: {
          morning: { type: Type.STRING },
          afternoon: { type: Type.STRING },
          evening: { type: Type.STRING },
          night: { type: Type.STRING }
        },
        required: ["morning", "afternoon", "evening", "night"]
      },
      healthGuidance: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "e.g., Hydration, Mental Health, Ergonomics" },
            advice: { type: Type.STRING }
          },
          required: ["category", "advice"]
        }
      },
      farmingSolutions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            problem: { type: Type.STRING },
            solution: { type: Type.STRING }
          },
          required: ["problem", "solution"]
        }
      },
      dailyHealthTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "5 short actionable health tips"
      },
      safetySuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 safety suggestions for tools/chemicals"
      }
    },
    required: ["timetable", "healthGuidance", "farmingSolutions", "dailyHealthTips", "safetySuggestions"]
  };

  return getStructuredAdvice(prompt, schema, language);
}

export async function getCropTimetable(cropName: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As an AI Agricultural Expert, generate a full crop timetable for "${cropName}".
    Provide a detailed schedule covering all stages from land preparation to harvesting.
    
    The timetable must include:
    1. Land Preparation: Time and Work details.
    2. Nursery: Time and Work details.
    3. Transplanting: Time and Work details.
    4. Water Management: Time and Work details.
    5. Fertilizer: Time and Work details.
    6. Pest Control: Time and Work details.
    7. Harvesting: Time and Work details.
    
    Also provide:
    - Tips: General advice for success.
    - Warnings: Common risks or mistakes to avoid.
    - Profit Advice: Financial strategy for better returns.
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}. Use simple, farmer-friendly language.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      cropName: { type: Type.STRING },
      timetable: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            stage: { type: Type.STRING, description: "e.g., Land Preparation, Nursery" },
            time: { type: Type.STRING, description: "When to do this (e.g., Day 1-5, Month 1)" },
            work: { type: Type.STRING, description: "What work needs to be done" }
          },
          required: ["stage", "time", "work"]
        }
      },
      tips: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      warnings: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      profitAdvice: { type: Type.STRING }
    },
    required: ["cropName", "timetable", "tips", "warnings", "profitAdvice"]
  };

  return getStructuredAdvice(prompt, schema, language);
}

export async function detectPestAndDisease(base64Image: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As an AI Agricultural Expert, analyze this plant image and identify the pest or disease.
    Provide the output in the following structured format:
    1. Pest/Disease Name
    2. Type (e.g. Insect, Fungal, Viral, Bacterial, Nutritional Deficiency)
    3. Confidence Level
    4. Symptoms observed on the plant
    5. Cause of the problem
    6. Chemical Treatment (Pesticide name, Dosage, Application method)
    7. Organic Treatment (Natural solution, Preparation method)
    8. Fertilizer Recommendation (Type, Quantity, Purpose)
    9. Fast Recovery Tips (Actionable steps for quick improvement)
    10. Prevention Tips
    11. Severity Level (Low/Medium/High)
    12. Representative Image URLs (3-4 high-quality URLs from reliable agricultural sources or Unsplash)
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}. Use simple, farmer-friendly language.
    `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Pest or Disease Name" },
      type: { type: Type.STRING, description: "Type of issue (e.g. Insect, Fungal, Viral, Bacterial, Nutritional Deficiency)" },
      confidence: { type: Type.STRING, description: "Confidence Level (e.g. 95%)" },
      symptoms: { type: Type.STRING, description: "Symptoms observed on the plant" },
      cause: { type: Type.STRING, description: "Cause of the problem" },
      chemicalTreatment: {
        type: Type.OBJECT,
        properties: {
          pesticide: { type: Type.STRING },
          dosage: { type: Type.STRING },
          method: { type: Type.STRING }
        },
        required: ["pesticide", "dosage", "method"]
      },
      organicTreatment: {
        type: Type.OBJECT,
        properties: {
          solution: { type: Type.STRING },
          preparation: { type: Type.STRING }
        },
        required: ["solution", "preparation"]
      },
      fertilizerRecommendation: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          quantity: { type: Type.STRING },
          purpose: { type: Type.STRING }
        },
        required: ["type", "quantity", "purpose"]
      },
      recoveryTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      preventionTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
      representativeImages: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 3-4 image URLs for visual confirmation"
      }
    },
    required: ["name", "type", "confidence", "symptoms", "cause", "chemicalTreatment", "organicTreatment", "fertilizerRecommendation", "recoveryTips", "preventionTips", "severity", "representativeImages"]
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function detectPlantDisease(base64Image: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As an AI Plant Pathologist, analyze this image.
    
    STEP 1: IMAGE VALIDATION
    Check if the image is a valid plant leaf or part of a plant. 
    If it is NOT a plant or leaf, set "isValidPlant" to false and provide a friendly message in "errorMessage".
    
    STEP 2: DISEASE DETECTION
    If valid, identify any diseases using global databases like FAO, PlantVillage, and ICAR (India).
    Look for leaf spots, color changes, and texture damage.
    
    Provide the output in the following structured format strictly following the "Smart Plant Disease Detection System" design:
    1. Plant Name (Common name)
    2. Disease Name (or "Healthy")
    3. Disease Type (e.g. Fungal, Bacterial, Viral, Nutrient Deficiency)
    4. About Disease (Brief explanation of the cause and impact)
    5. Symptoms (List of visible signs observed)
    6. Prevention (List of methods to avoid future occurrence)
    7. Organic Treatment (Natural solutions like Neem oil, etc.)
    8. Chemical Treatment (Pesticides, fungicides with dosage)
    9. Fertilizer Recommendation (Specific nutrients needed for recovery)
    10. Fast Recovery Tips (Actionable steps for quick improvement)
    11. Confidence Level (0-100%)
    12. Severity Level (Low/Medium/High)
    13. Representative Image URLs (3-4 high-quality URLs for visual comparison)
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}. Use simple, farmer-friendly language.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      isValidPlant: { type: Type.BOOLEAN, description: "Whether the image is a valid plant/leaf" },
      errorMessage: { type: Type.STRING, description: "Message if the image is not a plant" },
      plantName: { type: Type.STRING },
      diseaseName: { type: Type.STRING },
      diseaseType: { type: Type.STRING },
      aboutDisease: { type: Type.STRING },
      symptoms: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      prevention: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      organicTreatment: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      chemicalTreatment: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      fertilizerRecommendation: { type: Type.STRING },
      recoveryTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      confidence: { type: Type.STRING },
      severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
      representativeImages: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: [
      "isValidPlant", "plantName", "diseaseName", "diseaseType", "aboutDisease", "symptoms", 
      "prevention", "organicTreatment", "chemicalTreatment", 
      "fertilizerRecommendation", "recoveryTips", "confidence", "severity", "representativeImages"
    ]
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function getRealtimeWeatherAdvice(location: string, crop: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `Fetch the current weather, 5-day forecast, and farming alerts for ${location}. 
    The farmer is growing ${crop === 'basil' ? 'Basil' : 'various crops'}.
    Provide detailed weather metrics (temp in Celsius, humidity %, wind in km/h, etc.), a 5-day forecast with high/low temps, 
    and specific farming alerts/instructions. 
    If the crop is Basil, include specific alerts for cold shock (<12°C), heat stress (>35°C), and downy mildew risk (high humidity).
    Include Air Quality Index (AQI) and UV Index if available.
    For icons, use standard weather condition names (e.g., "Clear", "Clouds", "Rain", "Snow", "Thunderstorm").
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}. Use simple, farmer-friendly language.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING },
      current: {
        type: Type.OBJECT,
        properties: {
          temp: { type: Type.NUMBER },
          feels_like: { type: Type.NUMBER },
          condition: { type: Type.STRING },
          humidity: { type: Type.NUMBER },
          wind_speed: { type: Type.NUMBER },
          rain_prob: { type: Type.NUMBER },
          pressure: { type: Type.NUMBER },
          visibility: { type: Type.NUMBER },
          aqi: { type: Type.STRING },
          uvi: { type: Type.STRING },
          uviValue: { type: Type.NUMBER },
          icon: { type: Type.STRING }
        },
        required: ["temp", "condition", "humidity", "wind_speed"]
      },
      forecast: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            temp_max: { type: Type.NUMBER },
            temp_min: { type: Type.NUMBER },
            condition: { type: Type.STRING },
            icon: { type: Type.STRING }
          },
          required: ["date", "temp_max", "temp_min", "condition"]
        }
      },
      alerts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            severity: { type: Type.STRING },
            risk: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["type", "severity", "risk", "advice"]
        }
      },
      farmingAdvice: { type: Type.STRING },
      riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
    },
    required: ["location", "current", "forecast", "alerts", "farmingAdvice", "riskLevel"]
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function detectNutrients(base64Image: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As an AI Soil and Plant Nutrition Expert, analyze this image of a plant or soil.
    
    STEP 1: IMAGE VALIDATION
    Check if the image shows a plant, leaf, or soil. 
    If not, set "isValid" to false.
    
    STEP 2: NUTRIENT ANALYSIS
    Identify visible signs of nutrient deficiencies (Nitrogen, Phosphorus, Potassium, Zinc, Iron, etc.).
    Look for yellowing (chlorosis), purple tints, stunted growth, or leaf tip burn.
    
    Provide the output in the following structured format:
    1. Status (Deficient / Sufficient / Excess)
    2. Primary Missing Nutrient (e.g. Nitrogen, Zinc)
    3. Symptoms observed
    4. Impact on crop yield
    5. Recommended Fertilizers (Organic and Chemical)
    6. Application Method
    7. Soil Health Tips
    8. Confidence Level (0-100%)
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}. Use simple, farmer-friendly language.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      isValid: { type: Type.BOOLEAN },
      status: { type: Type.STRING },
      missingNutrient: { type: Type.STRING },
      symptoms: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      impact: { type: Type.STRING },
      recommendations: {
        type: Type.OBJECT,
        properties: {
          organic: { type: Type.STRING },
          chemical: { type: Type.STRING }
        },
        required: ["organic", "chemical"]
      },
      applicationMethod: { type: Type.STRING },
      soilTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      confidence: { type: Type.STRING }
    },
    required: ["isValid", "status", "missingNutrient", "symptoms", "impact", "recommendations", "applicationMethod", "soilTips", "confidence"]
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function detectAnything(base64Image: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As an AI Agricultural Scientist, analyze this image.
    
    STEP 1: IDENTIFICATION
    Determine if the image shows a plant, leaf, pest, insect, or soil.
    Identify the primary issue: Is it a Disease, a Pest/Insect, or a Nutrient Deficiency?
    
    STEP 2: DETAILED ANALYSIS
    - If Disease: Identify name, type, symptoms, and treatment.
    - If Pest: Identify name, type, damage caused, and control methods.
    - If Nutrient Deficiency: Identify missing nutrient, symptoms, and fertilizer recommendation.
    
    Provide the output in the following structured format:
    1. Category (Disease / Pest / Nutrient Deficiency / Healthy)
    2. Name of the issue or plant
    3. Type (e.g. Fungal, Insect, N-P-K Deficiency)
    4. Confidence Level (0-100%)
    5. Symptoms / Damage observed
    6. About / Cause (Brief explanation)
    7. Organic Solution (Natural methods)
    8. Chemical Solution (Pesticides/Fertilizers with dosage)
    9. Prevention Tips
    10. Severity (Low/Medium/High)
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}. Use simple, farmer-friendly language.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, enum: ["Disease", "Pest", "Nutrient Deficiency", "Healthy", "Unknown"] },
      name: { type: Type.STRING },
      type: { type: Type.STRING },
      confidence: { type: Type.STRING },
      symptoms: { type: Type.STRING },
      cause: { type: Type.STRING },
      organicSolution: { type: Type.STRING },
      chemicalSolution: { type: Type.STRING },
      prevention: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
    },
    required: ["category", "name", "type", "confidence", "symptoms", "cause", "organicSolution", "chemicalSolution", "prevention", "severity"]
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function getIrrigationAdvice(data: any, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As a Smart Irrigation Assistant, provide a detailed irrigation plan based on the following data: ${JSON.stringify(data)}.
    
    Your job:
    1. Analyze the crop, location, and water availability to provide real agricultural advice.
    2. Provide a Daily Water Schedule (Time and Frequency).
    3. Recommend the Best Irrigation Method (Drip, Sprinkler, or Flood).
    4. Give practical Water Saving Tips.
    5. Provide a Warning if there is a risk of over or under watering.
    
    Use VERY SIMPLE language (like speaking to a farmer). Avoid technical words. Give only practical and real advice.
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      schedule: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: "Best time of day to water" },
          frequency: { type: Type.STRING, description: "How often to water (e.g., once a day, every 2 days)" }
        },
        required: ["time", "frequency"]
      },
      bestMethod: { type: Type.STRING, description: "Recommended irrigation method (Drip/Sprinkler/Flood)" },
      waterSavingTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Practical tips to save water"
      },
      warning: { type: Type.STRING, description: "Warning about over/under watering risks" },
      recommendation: { type: Type.STRING, description: "General summary of the irrigation plan" }
    },
    required: ["schedule", "bestMethod", "waterSavingTips", "warning", "recommendation"]
  };

  return getStructuredAdvice(prompt, schema, language);
}

export async function getYieldProtectionAdvice(cropName: string, mode: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As a Smart Agriculture AI for Yield Protection, analyze the crop "${cropName}" for mode "${mode}".
    
    Your job:
    1. Predict crop yield (low/medium/high with reason).
    2. Give yield protection methods: Water management, Fertilizer usage, Pest control, Disease prevention.
    3. Adjust output based on mode:
       - 1R: Basic simple advice.
       - 2R: Detailed farming practices.
       - 3R: Full smart prediction + risk + profit.
    4. Use VERY SIMPLE language (like speaking to a farmer). Avoid technical words.
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      yieldPrediction: { type: Type.STRING, description: "Detailed yield prediction with reason" },
      yieldLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Yield level" },
      waterProtection: { type: Type.STRING, description: "Water management advice" },
      fertilizerPlan: { type: Type.STRING, description: "Fertilizer usage advice" },
      pestControl: { type: Type.STRING, description: "Pest control advice" },
      diseaseProtection: { type: Type.STRING, description: "Disease prevention advice" },
      risks: { type: Type.STRING, description: "Potential risks" },
      profitTips: { type: Type.STRING, description: "Tips to maximize profit" }
    },
    required: ["yieldPrediction", "yieldLevel", "waterProtection", "fertilizerPlan", "pestControl", "diseaseProtection", "risks", "profitTips"]
  };

  return getStructuredAdvice(prompt, schema, language);
}

export async function getNutrientAnalysisAdvice(cropName: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As a Smart Crop Nutrition Analyzer AI, analyze the nutrition requirements for the crop "${cropName}".
    
    Your job:
    1. Identify essential nutrients (Macronutrients, Secondary, Micronutrients).
    2. Analyze nutrient roles, deficiency signs, and yield improvement advice.
    3. Provide practical recommendations for organic and chemical fertilizers with application timing.
    4. Use VERY SIMPLE language (like speaking to a farmer). Avoid technical words.
    
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      crop: { type: Type.STRING, description: "Crop name" },
      importantNutrients: { type: Type.STRING, description: "List of essential nutrients (Macro, Secondary, Micro)" },
      nutrientRole: { type: Type.STRING, description: "Role of these nutrients in crop growth" },
      deficiencySigns: { type: Type.STRING, description: "Symptoms of nutrient deficiency" },
      nutritionPlan: { type: Type.STRING, description: "Detailed plan with organic and chemical fertilizers" },
      whenToApply: { type: Type.STRING, description: "Stage-wise application timing" },
      healthyCropTips: { type: Type.STRING, description: "General tips for a healthy crop" },
      yieldImprovementAdvice: { type: Type.STRING, description: "Advice on how to improve yield through nutrition" }
    },
    required: ["crop", "importantNutrients", "nutrientRole", "deficiencySigns", "nutritionPlan", "whenToApply", "healthyCropTips", "yieldImprovementAdvice"]
  };

  return getStructuredAdvice(prompt, schema, language);
}

export async function getMarketPriceAdvice(cropType: string, region: string, quantity: string, language: string = 'en') {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const prompt = `As an AI Market Analyst, fetch the REAL-TIME market prices for ${cropType} in ${region} and nearby areas.
    The farmer has ${quantity} kg of ${cropType}.
    
    Your job:
    1. Use Google Search to find the latest (today's) market prices for ${cropType} in ${region}.
    2. Provide a 6-month price forecast trend based on current market signals.
    3. Identify the best time to sell to maximize profit.
    4. List 3-4 nearby markets with their current prices and distances.
    5. Calculate the total value for ${quantity} kg based on the current price.
    6. Provide a detailed market analysis.
    
    IMPORTANT: All prices must be converted to "Price per kg" (e.g., ₹40/kg or $0.50/kg).
    IMPORTANT: Provide all text fields in the JSON response strictly in ${langName}. Use simple, farmer-friendly language.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      currentPricePerKg: { type: Type.STRING, description: "Current market price per kg (e.g., ₹45/kg)" },
      totalValue: { type: Type.STRING, description: "Total value for the given quantity" },
      forecastData: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            month: { type: Type.STRING },
            price: { type: Type.NUMBER, description: "Price per kg" }
          },
          required: ["month", "price"]
        }
      },
      bestTimeToSell: { type: Type.STRING },
      nearbyMarkets: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            distance: { type: Type.STRING },
            currentPrice: { type: Type.STRING, description: "Price per kg at this market" }
          },
          required: ["name", "distance", "currentPrice"]
        }
      },
      marketAnalysis: { type: Type.STRING }
    },
    required: ["currentPricePerKg", "totalValue", "forecastData", "bestTimeToSell", "nearbyMarkets", "marketAnalysis"]
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  return JSON.parse(response.text || "{}");
}
