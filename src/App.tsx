import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Droplets,
  Bug,
  Calculator,
  Leaf,
  PieChart,
  Coins,
  BookOpen,
  Heart,
  Zap,
  Clock,
  Stethoscope,
  FlaskConical,
  ArrowRight,
  User,
  ShieldCheck,
  AlertTriangle,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplet,
  RefreshCw,
  MapPin
} from 'lucide-react';

// Components
import { CropYieldPrediction } from './components/CropYieldPrediction';
import { YieldProtection } from './components/YieldProtection';
import { IrrigationRecommendation } from './components/IrrigationRecommendation';
import { PestDetection } from './components/PestDetection';
import { NutrientAnalyzer } from './components/NutrientAnalyzer';
import { DailyTimetable } from './components/DailyTimetable';
import { DiseaseDetection } from './components/DiseaseDetection';
import { FertilizerRecommendation } from './components/FertilizerRecommendation';
import { MarketPricePrediction } from './components/MarketPricePrediction';
import { CropRecommendation } from './components/CropRecommendation';
import { SmartPlanner } from './components/SmartPlanner';
import { FarmingGuidance } from './components/FarmingGuidance';
import { FarmerWellness } from './components/FarmerWellness';

const TRANSLATIONS = {
  en: {
    title: 'Smart Agri AI',
    subtitle: 'Your Intelligent Farming Assistant',
    common: {
      launch: 'Launch Tool',
      activeModule: 'Active Module',
      activeSession: 'Active Session',
      aboutTool: 'About this Tool',
      keyBenefits: 'Key Benefits',
      interactiveTool: 'Interactive Tool',
      startAnalysis: 'Start Analysis',
      searchPlaceholder: 'Search features...',
      home: 'Home',
      tools: 'Tools',
      alerts: 'Alerts',
      profile: 'Profile',
      workingProcess: 'Working Process',
      analyze: 'Analyze',
      back: 'Back'
    },
    sidebar: {
      timetable: 'Crop Timetable',
      irrigation: 'Smart Irrigation',
      yield: 'Yield Prediction',
      protection: 'Yield Protection',
      nutrient: 'Nutrition Analyzer',
      pest: 'Pest Detection',
      disease: 'Plant Disease Detection',
      fertilizer: 'Fertilizer Guide',
      market: 'Market Prices',
      advisor: 'Crop Advisor',
      planner: 'Smart Farm Planner',
      guide: 'Farming Guide',
      wellness: 'Farming Health Hub',
    },
    languages: {
      en: 'English',
      te: 'తెలుగు',
      hi: 'हिन्दी'
    },
    featureDetails: {
      pest: {
        desc: 'Advanced AI vision system to identify crop pests and diseases from leaf images. Get instant organic and chemical control recommendations.',
        process: ['Upload or capture a clear photo of the affected leaf', 'AI analyzes patterns, spots, and insect presence', 'Receive a detailed diagnosis and treatment plan'],
        benefits: ['98% accuracy in pest identification', 'Reduces crop loss by up to 40%', 'Eco-friendly treatment suggestions']
      },
      disease: {
        desc: 'Smart AI system to detect plant diseases, classify types, and suggest organic or chemical treatments instantly.',
        process: ['Scan a plant leaf or upload a photo', 'AI identifies the disease and severity', 'Get instant treatment and prevention advice'],
        benefits: ['Instant diagnostics', 'Organic & Chemical solutions', 'Prevents crop spread']
      },
      irrigation: {
        desc: 'Precision water management system that calculates exact water needs based on soil moisture, crop type, and local weather forecasts.',
        process: ['Select your crop and current growth stage', 'System syncs with local weather and soil data', 'Receive a precise daily watering schedule'],
        benefits: ['Saves up to 50% water', 'Prevents root rot and water stress', 'Automated scheduling alerts']
      },
      yield: {
        desc: 'AI-powered harvest security tool. Predict your crop yield and get a complete protection plan for water, fertilizer, pests, and diseases.',
        process: ['Enter your crop name', 'Select a mode (1R, 2R, or 3R)', 'Get a detailed yield prediction and protection plan'],
        benefits: ['Secure your harvest', 'Maximize profit', 'Real agricultural knowledge']
      },
      nutrient: {
        desc: 'Expert crop nutrition advisor. Get essential nutrient analysis, deficiency guides, and complete organic/chemical fertilizer plans for any crop.',
        process: ['Enter your crop name', 'Get a detailed nutrient and deficiency analysis', 'Follow the step-by-step nutrition and yield improvement plan'],
        benefits: ['Maximum harvest yield', 'Balanced soil health', 'Practical fertilizer guidance']
      },
      timetable: {
        desc: 'Automated farm operations scheduler. Generates a perfect daily routine for irrigation, weeding, and fertilization based on real-time data.',
        process: ['Sync your farm location and crop types', 'AI calculates optimal task timing', 'Receive daily push notifications for tasks'],
        benefits: ['Maximum time efficiency', 'Never miss a critical task', 'Organized farm labor']
      },
      fertilizer: {
        desc: 'Expert fertilizer dosage calculator. Get specific recommendations for organic and inorganic fertilizers based on your specific land area.',
        process: ['Enter your farm area and crop type', 'Input recent soil test results if available', 'Get a step-by-step application guide'],
        benefits: ['Balanced soil nutrition', 'Increased harvest weight', 'Minimized environmental runoff']
      },
      market: {
        desc: 'Real-time tracking of commodity prices across local and national markets. Predict future price trends to maximize your selling profit.',
        process: ['Select the crop you want to sell', 'Choose your nearest market or state', 'Analyze price trends for the next 30 days'],
        benefits: ['Sell at the highest price', 'Avoid middleman exploitation', 'Real-time market transparency']
      },
      advisor: {
        desc: 'Intelligent land-use advisor. Recommends the most profitable and sustainable crops for your specific soil type and climate zone.',
        process: ['Enter soil pH, texture, and moisture levels', 'System analyzes regional climate patterns', 'Get a list of top 5 recommended crops'],
        benefits: ['Maximizes land potential', 'Reduces crop failure risk', 'Promotes crop rotation health']
      },
      planner: {
        desc: 'Combined resource and budget planning tool. Calculate seeds, fertilizer, and water needs while estimating costs and potential profit in one step.',
        process: ['Enter crop name and field size', 'AI calculates all required resources', 'Get a complete financial budget and profit projection'],
        benefits: ['Eliminates resource waste', 'Complete financial control', 'One-stop planning solution']
      },
      guide: {
        desc: 'Digital encyclopedia for agriculture. Access stage-by-stage instructions from seed sowing to post-harvest management for 50+ crops.',
        process: ['Select your crop from the library', 'Choose the current growth stage', 'Follow detailed visual and text instructions'],
        benefits: ['Standardized farming practices', 'Learn new crop management', 'Reduced human error']
      },
      wellness: {
        desc: 'Safety and health hub for farmers. Get alerts on heatwaves, chemical safety tips, and ergonomic advice to prevent farming-related injuries.',
        process: ['Check daily weather-related health risks', 'Read safety guides for pesticide handling', 'Follow ergonomic exercise routines'],
        benefits: ['Improved physical health', 'Reduced workplace accidents', 'Mental well-being support']
      }
    }
  },
  te: {
    title: 'స్మార్ట్ అగ్రి AI',
    subtitle: 'మీ తెలివైన వ్యవసాయ సహాయకుడు',
    common: {
      launch: 'టూల్‌ను ప్రారంభించండి',
      activeModule: 'యాక్టివ్ మాడ్యూల్',
      activeSession: 'యాక్టివ్ సెషన్',
      aboutTool: 'ఈ టూల్ గురించి',
      keyBenefits: 'ముఖ్య ప్రయోజనాలు',
      interactiveTool: 'ఇంటరాక్టివ్ టూల్',
      startAnalysis: 'విశ్లేషణ ప్రారంభించండి',
      searchPlaceholder: 'ఫీచర్లను వెతకండి...',
      home: 'హోమ్',
      tools: 'టూల్స్',
      alerts: 'అలర్ట్స్',
      profile: 'ప్రొఫైల్',
      workingProcess: 'పని ప్రక్రియ',
      analyze: 'విశ్లేషించు',
      back: 'వెనుకకు'
    },
    sidebar: {
      timetable: 'పంట టైమ్‌టేబుల్',
      irrigation: 'స్మార్ట్ నీటిపారుదల',
      yield: 'దిగుబడి అంచనా',
      protection: 'దిగుబడి రక్షణ',
      nutrient: 'పోషక విశ్లేషణ',
      pest: 'తెగుళ్ల గుర్తింపు',
      disease: 'మొక్కల వ్యాధి గుర్తింపు',
      fertilizer: 'ఎరువుల గైడ్',
      market: 'మార్కెట్ ధరలు',
      advisor: 'పంట సలహాదారు',
      planner: 'స్మార్ట్ ఫామ్ ప్లానర్',
      guide: 'వ్యవసాయ గైడ్',
      wellness: 'రైతు ఆరోగ్య కేంద్రం',
    },
    languages: {
      en: 'English',
      te: 'తెలుగు',
      hi: 'हिन्दी'
    },
    featureDetails: {
      pest: {
        desc: 'ఆకు చిత్రాల నుండి పంట తెగుళ్లు మరియు వ్యాధులను గుర్తించడానికి అధునాతన AI విజన్ సిస్టమ్. తక్షణ సేంద్రియ మరియు రసాయన నియంత్రణ సిఫార్సులను పొందండి.',
        process: ['ప్రభావితమైన ఆకు యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి లేదా తీయండి', 'AI నమూనాలు, మచ్చలు మరియు కీటకాల ఉనికిని విశ్లేషిస్తుంది', 'వివరణాత్మక రోగ నిర్ధారణ మరియు చికిత్స ప్రణాళికను పొందండి'],
        benefits: ['కీటకాల గుర్తింపులో 98% ఖచ్చితత్వం', 'పంట నష్టాన్ని 40% వరకు తగ్గిస్తుంది', 'పర్యావరణ అనుకూల చికిత్స సూచనలు']
      },
      disease: {
        desc: 'మొక్కల వ్యాధులను గుర్తించడానికి, రకాలను వర్గీకరించడానికి మరియు తక్షణమే సేంద్రియ లేదా రసాయన చికిత్సలను సూచించడానికి స్మార్ట్ AI సిస్టమ్.',
        process: ['మొక్క ఆకును స్కాన్ చేయండి లేదా ఫోటోను అప్‌లోడ్ చేయండి', 'AI వ్యాధిని మరియు తీవ్రతను గుర్తిస్తుంది', 'తక్షణ చికిత్స మరియు నివారణ సలహాలను పొందండి'],
        benefits: ['తక్షణ రోగ నిర్ధారణ', 'సేంద్రియ & రసాయన పరిష్కారాలు', 'పంట వ్యాప్తిని నిరోధిస్తుంది']
      },
      irrigation: {
        desc: 'నేల తేమ, పంట రకం మరియు స్థానిక వాతావరణ సూచనల ఆధారంగా ఖచ్చితమైన నీటి అవసరాలను లెక్కించే ఖచ్చితమైన నీటి నిర్వహణ వ్యవస్థ.',
        process: ['మీ పంటను మరియు ప్రస్తుత ఎదుగుదల దశను ఎంచుకోండి', 'సిస్టమ్ స్థానిక వాతావరణం మరియు నేల డేటాతో సమకాలీకరిస్తుంది', 'ఖచ్చితమైన రోజువారీ నీటి షెడ్యూల్‌ను పొందండి'],
        benefits: ['50% వరకు నీటిని ఆదా చేస్తుంది', 'వేరు కుళ్లు మరియు నీటి ఒత్తిడిని నివారిస్తుంది', 'ఆటోమేటెడ్ షెడ్యూలింగ్ హెచ్చరికలు']
      },
      yield: {
        desc: 'AI-ఆధారిత పంట భద్రతా సాధనం. మీ పంట దిగుబడిని అంచనా వేయండి మరియు నీరు, ఎరువులు, తెగుళ్లు మరియు వ్యాధుల కోసం పూర్తి రక్షణ ప్రణాళికను పొందండి.',
        process: ['మీ పంట పేరును నమోదు చేయండి', 'ఒక మోడ్‌ను ఎంచుకోండి (1R, 2R, లేదా 3R)', 'వివరణాత్మక దిగుబడి అంచనా మరియు రక్షణ ప్రణాళికను పొందండి'],
        benefits: ['మీ పంటను సురక్షితం చేసుకోండి', 'లాభాన్ని పెంచుకోండి', 'నిజమైన వ్యవసాయ జ్ఞానం']
      },
      nutrient: {
        desc: 'నిపుణుల పంట పోషణ సలహాదారు. ఏదైనా పంట కోసం అవసరమైన పోషక విశ్లేషణ, లోపం గైడ్‌లు మరియు పూర్తి సేంద్రియ/రసాయన ఎరువుల ప్రణాళికలను పొందండి.',
        process: ['మీ పంట పేరును నమోదు చేయండి', 'వివరణాత్మక పోషక మరియు లోపం విశ్లేషణను పొందండి', 'దశల వారీ పోషణ మరియు దిగుబడి మెరుగుదల ప్రణాళికను అనుసరించండి'],
        benefits: ['గరిష్ట పంట దిగుబడి', 'సమతుల్య నేల ఆరోగ్యం', 'ప్రయోగాత్మక ఎరువుల మార్గదర్శకత్వం']
      },
      timetable: {
        desc: 'ఆటోమేటెడ్ ఫారం ఆపరేషన్స్ షెడ్యూలర్. నిజ-సమయ డేటా ఆధారంగా నీటిపారుదల, కలుపు తీయడం మరియు ఎరువుల కోసం సరైన రోజువారీ దినచర్యను రూపొందిస్తుంది.',
        process: ['మీ ఫారం స్థానం మరియు పంట రకాలను సమకాలీకరించండి', 'AI సరైన పని సమయాన్ని లెక్కిస్తుంది', 'పనుల కోసం రోజువారీ పుష్ నోటిఫికేషన్లను పొందండి'],
        benefits: ['గరిష్ట సమయ సామర్థ్యం', 'ముఖ్యమైన పనిని ఎప్పుడూ కోల్పోకండి', 'వ్యవస్థీకృత ఫారం శ్రమ']
      },
      fertilizer: {
        desc: 'నిపుణుల ఎరువుల మోతాదు కాలిక్యులేటర్. మీ నిర్దిష్ట భూభాగం ఆధారంగా సేంద్రియ మరియు అకర్బన ఎరువుల కోసం నిర్దిష్ట సిఫార్సులను పొందండి.',
        process: ['మీ ఫారం ఏరిీయా మరియు పంట రకాన్ని నమోదు చేయండి', 'అందుబాటులో ఉంటే ఇటీవలి నేల పరీక్ష ఫలితాలను ఇన్‌పుట్ చేయండి', 'దశల వారీ అప్లికేషన్ గైడ్‌ను పొందండి'],
        benefits: ['సమతుల్య నేల పోషణ', 'పెరిగిన పంట బరువు', 'తగ్గిన పర్యావరణ ప్రభావం']
      },
      market: {
        desc: 'స్థానిక మరియు జాతీయ మార్కెట్లలో వస్తువుల ధరల నిజ-సమయ ట్రాకింగ్. మీ అమ్మకపు లాభాన్ని పెంచడానికి భవిష్యత్తు ధరల ధోరణులను అంచనా వేయండి.',
        process: ['మీరు విక్రయించాలనుకుంటున్న పంటను ఎంచుకోండి', 'మీ సమీప మార్కెట్ లేదా రాష్ట్రాన్ని ఎంచుకోండి', 'తదుపరి 30 రోజుల ధరల ధోరణులను విశ్లేషించండి'],
        benefits: ['అత్యధిక ధరకు విక్రయించండి', 'మధ్యవర్తుల దోపిడీని నివారించండి', 'నిజ-సమయ మార్కెట్ పారదర్శకత']
      },
      advisor: {
        desc: 'తెలివైన భూ-వినియోగ సలహాదారు. మీ నిర్దిష్ట నేల రకం మరియు వాతావరణ జోన్ కోసం అత్యంత లాభదాయకమైన మరియు స్థిరమైన పంటలను సిఫార్సు చేస్తుంది.',
        process: ['నేల pH, ఆకృతి మరియు తేమ స్థాయిలను నమోదు చేయండి', 'సిస్టమ్ ప్రాంతీయ వాతావరణ నమూనాలను విశ్లేషిస్తుంది', 'టాప్ 5 సిఫార్సు చేసిన పంటల జాబితాను పొందండి'],
        benefits: ['భూమి సామర్థ్యాన్ని పెంచుతుంది', 'పంట వైఫల్య ప్రమాదాన్ని తగ్గిస్తుంది', 'పంట మార్పిడి ఆరోగ్యాన్ని ప్రోత్సహిస్తుంది']
      },
      planner: {
        desc: 'వనరులు మరియు బడ్జెట్ ప్రణాళిక సాధనం. విత్తనాలు, ఎరువులు మరియు నీటి అవసరాలను లెక్కించండి మరియు ఖర్చులు మరియు సంభావ్య లాభాలను ఒకే దశలో అంచనా వేయండి.',
        process: ['పంట పేరు మరియు పొలం పరిమాణాన్ని నమోదు చేయండి', 'AI అవసరమైన అన్ని వనరులను లెక్కిస్తుంది', 'పూర్తి ఆర్థిక బడ్జెట్ మరియు లాభాల అంచనాను పొందండి'],
        benefits: ['వనరుల వృధాను తొలగిస్తుంది', 'పూర్తి ఆర్థిక నియంత్రణ', 'వన్-స్టాప్ ప్లానింగ్ పరిష్కారం']
      },
      guide: {
        desc: 'వ్యవసాయం కోసం డిజిటల్ ఎన్సైక్లోపీడియా. 50+ పంటల కోసం విత్తనాలు విత్తడం నుండి పంట కోత అనంతర నిర్వహణ వరకు దశల వారీ సూచనలను పొందండి.',
        process: ['లైబ్రరీ నుండి మీ పంటను ఎంచుకోండి', 'ప్రస్తుత ఎదుగుదల దశను ఎంచుకోండి', 'వివరణాత్మక దృశ్య మరియు వచన సూచనలను అనుసరించండి'],
        benefits: ['ప్రామాణిక వ్యవసాయ పద్ధతులు', 'కొత్త పంట నిర్వహణను నేర్చుకోండి', 'మానవ తప్పిదాలను తగ్గిస్తుంది']
      },
      wellness: {
        desc: 'రైతుల కోసం భద్రత మరియు ఆరోగ్య కేంద్రం. వడగాల్పుల హెచ్చరికలు, రసాయన భద్రతా చిట్కాలు మరియు వ్యవసాయ సంబంధిత గాయాలను నివారించడానికి ఎర్గోనామిక్ సలహాలను పొందండి.',
        process: ['రోజువారీ వాతావరణ సంబంధిత ఆరోగ్య ప్రమాదాలను తనిఖీ చేయండి', 'క్రిమిసంహారక మందుల నిర్వహణ కోసం భద్రతా మార్గదర్శకాలను చదవండి', 'ఎర్గోనామిక్ వ్యాయామ దినచర్యలను అనుసరించండి'],
        benefits: ['మెరుగైన శారీరక ఆరోగ్యం', 'తగ్గిన కార్యాలయ ప్రమాదాలు', 'మానసిక శ్రేయస్సు మద్దతు']
      }
    }
  },
  hi: {
    title: 'स्मार्ट एग्री AI',
    subtitle: 'आपका बुद्धिमान खेती सहायक',
    common: {
      launch: 'टूल लॉन्च करें',
      activeModule: 'सक्रिय मॉड्यूल',
      activeSession: 'सक्रिय सत्र',
      aboutTool: 'इस टूल के बारे में',
      keyBenefits: 'मुख्य लाभ',
      interactiveTool: 'इंटरैक्टिव टूल',
      startAnalysis: 'विश्लेषण शुरू करें',
      searchPlaceholder: 'सुविधाएँ खोजें...',
      home: 'होम',
      tools: 'उपकरण',
      alerts: 'अलर्ट',
      profile: 'प्रोफ़ाइल',
      workingProcess: 'कार्य प्रक्रिया',
      analyze: 'विश्लेषण करें',
      back: 'पीछे'
    },
    sidebar: {
      timetable: 'फसल समय सारणी',
      irrigation: 'स्मार्ट सिंचाई',
      yield: 'उपज भविष्यवाणी',
      protection: 'उपज सुरक्षा',
      nutrient: 'पोषण विश्लेषक',
      pest: 'कीट पहचान',
      disease: 'पौधों के रोग की पहचान',
      fertilizer: 'उर्वरक गाइड',
      market: 'बाजार मूल्य',
      advisor: 'फसल सलाहकार',
      planner: 'स्मार्ट फार्म प्लानर',
      guide: 'खेती गाइड',
      wellness: 'किसान स्वास्थ्य केंद्र',
    },
    languages: {
      en: 'English',
      te: 'తెలుగు',
      hi: 'हिन्दी'
    },
    featureDetails: {
      pest: {
        desc: 'पत्ती की छवियों से फसल कीटों और रोगों की पहचान करने के लिए उन्नत AI विज़न सिस्टम। तत्काल जैविक और रासायनिक नियंत्रण सिफारिशें प्राप्त करें।',
        process: ['प्रभावित पत्ती की एक स्पष्ट फोटो अपलोड करें या खींचें', 'AI पैटर्न, धब्बों और कीटों की उपस्थिति का विश्लेषण करता है', 'विस्तृत निदान और उपचार योजना प्राप्त करें'],
        benefits: ['कीट पहचान में 98% सटीकता', 'फसल के नुकसान को 40% तक कम करता है', 'पर्यावरण के अनुकूल उपचार सुझाव']
      },
      disease: {
        desc: 'पौधों के रोगों का पता लगाने, प्रकारों को वर्गीकृत करने और तुरंत जैविक या रासायनिक उपचारों का सुझाव देने के लिए स्मार्ट AI सिस्टम।',
        process: ['पौधे की पत्ती को स्कैन करें या फोटो अपलोड करें', 'AI रोग और गंभीरता की पहचान करता है', 'तत्काल उपचार और रोकथाम सलाह प्राप्त करें'],
        benefits: ['तत्काल निदान', 'जैविक और रासायनिक समाधान', 'फसल के प्रसार को रोकता है']
      },
      irrigation: {
        desc: 'सटीक जल प्रबंधन प्रणाली जो मिट्टी की नमी, फसल के प्रकार और स्थानीय मौसम के पूर्वानुमान के आधार पर सटीक पानी की जरूरतों की गणना करती है।',
        process: ['अपनी फसल और वर्तमान विकास चरण का चयन करें', 'सिस्टम स्थानीय मौसम और मिट्टी के डेटा के साथ सिंक करता है', 'सटीक दैनिक पानी का शेड्यूल प्राप्त करें'],
        benefits: ['50% तक पानी बचाता है', 'जड़ सड़न और पानी के तनाव को रोकता है', 'स्वचालित शेड्यूलिंग अलर्ट']
      },
      yield: {
        desc: 'AI-संचालित फसल सुरक्षा उपकरण। अपनी फसल की उपज का अनुमान लगाएं और पानी, उर्वरक, कीटों और रोगों के लिए एक पूर्ण सुरक्षा योजना प्राप्त करें।',
        process: ['अपनी फसल का नाम दर्ज करें', 'एक मोड चुनें (1R, 2R, या 3R)', 'विस्तृत उपज भविष्यवाणी और सुरक्षा योजना प्राप्त करें'],
        benefits: ['अपनी फसल सुरक्षित करें', 'लाभ अधिकतम करें', 'वास्तविक कृषि ज्ञान']
      },
      nutrient: {
        desc: 'विशेषज्ञ फसल पोषण सलाहकार। किसी भी फसल के लिए आवश्यक पोषक तत्व विश्लेषण, कमी गाइड और पूर्ण जैविक/रासायनिक उर्वरक योजनाएं प्राप्त करें।',
        process: ['अपनी फसल का नाम दर्ज करें', 'विस्तृत पोषक तत्व और कमी विश्लेषण प्राप्त करें', 'चरण-दर-चरण पोषण और उपज सुधार योजना का पालन करें'],
        benefits: ['अधिकतम फसल उपज', 'संतुलित मिट्टी स्वास्थ्य', 'व्यावहारिक उर्वरक मार्गदर्शन']
      },
      timetable: {
        desc: 'स्वचालित फार्म संचालन शेड्यूलर। वास्तविक समय के डेटा के आधार पर सिंचाई, निराई और उर्वरक के लिए एक आदर्श दैनिक दिनचर्या उत्पन्न करता है।',
        process: ['अपने फार्म स्थान और फसल के प्रकारों को सिंक करें', 'AI इष्टतम कार्य समय की गणना करता है', 'कार्यों के लिए दैनिक पुश सूचनाएं प्राप्त करें'],
        benefits: ['अधिकतम समय दक्षता', 'कभी भी कोई महत्वपूर्ण कार्य न चूकें', 'व्यवस्थित फार्म श्रम']
      },
      fertilizer: {
        desc: 'विशेषज्ञ उर्वरक खुराक कैलकुलेटर। अपने विशिष्ट भूमि क्षेत्र के आधार पर जैविक और अकार्बनिक उर्वरकों के लिए विशिष्ट सिफारिशें प्राप्त करें।',
        process: ['अपना फार्म क्षेत्र और फसल का प्रकार दर्ज करें', 'उपलब्ध होने पर हाल के मिट्टी परीक्षण परिणाम इनपुट करें', 'चरण-दर-चरण आवेदन गाइड प्राप्त करें'],
        benefits: ['संतुलित मिट्टी पोषण', 'फसल के वजन में वृद्धि', 'न्यूनतम पर्यावरणीय प्रभाव']
      },
      market: {
        desc: 'स्थानीय और राष्ट्रीय बाजारों में वस्तुओं की कीमतों की वास्तविक समय पर ट्रैकिंग। अपने बिक्री लाभ को अधिकतम करने के लिए भविष्य के मूल्य रुझानों की भविष्यवाणी करें।',
        process: ['वह फसल चुनें जिसे आप बेचना चाहते हैं', 'अपना निकटतम बाजार या राज्य चुनें', 'अगले 30 दिनों के लिए मूल्य रुझानों का विश्लेषण करें'],
        benefits: ['उच्चतम मूल्य पर बेचें', 'बिचौलियों के शोषण से बचें', 'वास्तविक समय बाजार पारदर्शिता']
      },
      advisor: {
        desc: 'बुद्धिमान भूमि-उपयोग सलाहकार। आपकी विशिष्ट मिट्टी के प्रकार और जलवायु क्षेत्र के लिए सबसे अधिक लाभदायक और टिकाऊ फसलों की सिफारिश करता है।',
        process: ['मिट्टी का पीएच, बनावट और नमी का स्तर दर्ज करें', 'सिस्टम क्षेत्रीय जलवायु पैटर्न का विश्लेषण करता है', 'शीर्ष 5 अनुशंसित फसलों की सूची प्राप्त करें'],
        benefits: ['भूमि की क्षमता को अधिकतम करता है', 'फसल विफलता के जोखिम को कम करता है', 'फसल चक्र स्वास्थ्य को बढ़ावा देता है']
      },
      planner: {
        desc: 'संयुक्त संसाधन और बजट नियोजन उपकरण। एक ही चरण में लागत और संभावित लाभ का अनुमान लगाते हुए बीज, उर्वरक और पानी की जरूरतों की गणना करें।',
        process: ['फसल का नाम और खेत का आकार दर्ज करें', 'AI सभी आवश्यक संसाधनों की गणना करता है', 'एक पूर्ण वित्तीय बजट और लाभ का अनुमान प्राप्त करें'],
        benefits: ['संसाधन बर्बादी को समाप्त करता है', 'पूर्ण वित्तीय नियंत्रण', 'वन-स्टॉप प्लानिंग समाधान']
      },
      guide: {
        desc: 'खेती के लिए डिजिटल विश्वकोश। 50+ फसलों के लिए बीज बोने से लेकर कटाई के बाद के प्रबंधन तक चरण-दर-चरण निर्देश प्राप्त करें।',
        process: ['लाइब्रेरी से अपनी फसल चुनें', 'वर्तमान विकास चरण चुनें', 'विस्तृत दृश्य और पाठ निर्देशों का पालन करें'],
        benefits: ['मानकीकृत खेती पद्धतियां', 'नई फसल प्रबंधन सीखें', 'मानवीय भूल को कम करता है']
      },
      wellness: {
        desc: 'किसानों के लिए सुरक्षा और स्वास्थ्य केंद्र। लू की चेतावनी, रासायनिक सुरक्षा युक्तियाँ और खेती से संबंधित चोटों को रोकने के लिए एर्गोनोमिक सलाह प्राप्त करें।',
        process: ['दैनिक मौसम संबंधी स्वास्थ्य जोखिमों की जाँच करें', 'कीटनाशक प्रबंधन के लिए सुरक्षा गाइड पढ़ें', 'एर्गोनोमिक व्यायाम दिनचर्या का पालन करें'],
        benefits: ['बेहतर शारीरिक स्वास्थ्य', 'कार्यस्थल दुर्घटनाओं में कमी', 'मानसिक कल्याण सहायता']
      }
    }
  }
};

export default function App() {
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'tools' | 'alerts' | 'profile'>('home');
  const [weather, setWeather] = useState<{ temp: number; condition: string; city: string; humidity: number; wind: number } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation not supported");
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error("Failed to fetch weather from backend");
        
        const data = await response.json();
        setWeather(data);
        setWeatherLoading(false);
      }, (error) => {
        console.error("Geolocation error:", error);
        setWeatherLoading(false);
      });
    } catch (error) {
      console.error("Weather error:", error);
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const t = TRANSLATIONS[language];

  const FEATURES = [
    {
      id: 'timetable',
      name: t.sidebar.timetable,
      icon: Clock,
      color: 'bg-blue-500',
      component: DailyTimetable,
      desc: t.featureDetails.timetable.desc,
      process: t.featureDetails.timetable.process,
      benefits: t.featureDetails.timetable.benefits
    },
    {
      id: 'irrigation',
      name: t.sidebar.irrigation,
      icon: Droplets,
      color: 'bg-cyan-500',
      component: IrrigationRecommendation,
      desc: t.featureDetails.irrigation.desc,
      process: t.featureDetails.irrigation.process,
      benefits: t.featureDetails.irrigation.benefits
    },
    {
      id: 'protection',
      name: t.sidebar.protection,
      icon: ShieldCheck,
      color: 'bg-orange-500',
      component: YieldProtection,
      desc: t.featureDetails.yield.desc,
      process: t.featureDetails.yield.process,
      benefits: t.featureDetails.yield.benefits
    },
    {
      id: 'nutrient',
      name: t.sidebar.nutrient,
      icon: FlaskConical,
      color: 'bg-indigo-500',
      component: NutrientAnalyzer,
      desc: t.featureDetails.nutrient.desc,
      process: t.featureDetails.nutrient.process,
      benefits: t.featureDetails.nutrient.benefits
    },
    {
      id: 'pest',
      name: t.sidebar.pest,
      icon: Bug,
      color: 'bg-red-500',
      component: PestDetection,
      desc: t.featureDetails.pest.desc,
      process: t.featureDetails.pest.process,
      benefits: t.featureDetails.pest.benefits
    },
    {
      id: 'disease',
      name: t.sidebar.disease,
      icon: Stethoscope,
      color: 'bg-rose-500',
      component: DiseaseDetection,
      desc: t.featureDetails.disease.desc,
      process: t.featureDetails.disease.process,
      benefits: t.featureDetails.disease.benefits
    },
    {
      id: 'fertilizer',
      name: t.sidebar.fertilizer,
      icon: Calculator,
      color: 'bg-amber-500',
      component: FertilizerRecommendation,
      desc: t.featureDetails.fertilizer.desc,
      process: t.featureDetails.fertilizer.process,
      benefits: t.featureDetails.fertilizer.benefits
    },
    {
      id: 'market',
      name: t.sidebar.market,
      icon: Coins,
      color: 'bg-yellow-500',
      component: MarketPricePrediction,
      desc: t.featureDetails.market.desc,
      process: t.featureDetails.market.process,
      benefits: t.featureDetails.market.benefits
    },
    {
      id: 'advisor',
      name: t.sidebar.advisor,
      icon: Sprout,
      color: 'bg-lime-500',
      component: CropRecommendation,
      desc: t.featureDetails.advisor.desc,
      process: t.featureDetails.advisor.process,
      benefits: t.featureDetails.advisor.benefits
    },
    {
      id: 'planner',
      name: t.sidebar.planner,
      icon: PieChart,
      color: 'bg-violet-500',
      component: SmartPlanner,
      desc: t.featureDetails.planner.desc,
      process: t.featureDetails.planner.process,
      benefits: t.featureDetails.planner.benefits
    },
    {
      id: 'guide',
      name: t.sidebar.guide,
      icon: BookOpen,
      color: 'bg-teal-500',
      component: FarmingGuidance,
      desc: t.featureDetails.guide.desc,
      process: t.featureDetails.guide.process,
      benefits: t.featureDetails.guide.benefits
    },
    {
      id: 'wellness',
      name: t.sidebar.wellness,
      icon: Heart,
      color: 'bg-pink-500',
      component: FarmerWellness,
      desc: t.featureDetails.wellness.desc,
      process: t.featureDetails.wellness.process,
      benefits: t.featureDetails.wellness.benefits
    }
  ];

  const activeFeatureData = useMemo(() => FEATURES.find(f => f.id === activeFeature), [activeFeature]);

  const renderHome = () => (
    <div className="space-y-6 pb-24">
      {/* Weather Widget */}
      <div className="bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] card-shadow border border-white/40 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-agri-green/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3 h-3" />
            {weather?.city || "Detecting..."}
          </div>
          <h3 className="text-4xl font-black text-stone-900">
            {weatherLoading ? "..." : `${weather?.temp || "--"}°C`}
          </h3>
          <p className="text-agri-green font-bold text-sm flex items-center gap-2">
            {weather?.condition || "Checking sky..."}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            {weather?.condition.includes("Rain") ? <CloudRain className="w-8 h-8 text-blue-400" /> :
             weather?.condition.includes("Cloud") ? <Cloud className="w-8 h-8 text-stone-400" /> :
             <Sun className="w-8 h-8 text-amber-400" />}
          </div>
          <div className="flex gap-3 text-[9px] font-bold text-stone-400">
            <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather?.wind || 0}km/h</span>
            <span className="flex items-center gap-1"><Droplet className="w-3 h-3" /> {weather?.humidity || 0}%</span>
          </div>
          <button 
            onClick={fetchWeather}
            disabled={weatherLoading}
            className="p-2 bg-white rounded-xl shadow-sm active:scale-90 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-agri-green ${weatherLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tool Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-stone-900 px-2">Farming Tools</h2>
        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className="bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] card-shadow border border-white/40 flex flex-col items-start text-left gap-4 active:scale-95 transition-all"
            >
              <div className={`${feature.color} p-4 rounded-2xl text-white shadow-lg`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-stone-900 text-sm leading-tight">{feature.name}</h3>
                <p className="text-[10px] text-stone-400 font-medium line-clamp-1">AI Powered Analysis</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-black text-stone-900 px-2">Daily Alerts</h2>
      <div className="space-y-4">
        {[
          { title: "Today: Apply fertilizer", desc: "Optimal time for nitrogen application based on growth stage.", type: "info", icon: Zap, color: "text-blue-500", bg: "bg-blue-50/80" },
          { title: "Rain expected, skip irrigation", desc: "Heavy rain predicted in 4 hours. Save water today.", type: "warning", icon: CloudRain, color: "text-amber-500", bg: "bg-amber-50/80" },
          { title: "Pest Alert: Whiteflies", desc: "Nearby farms reporting whitefly activity. Check your crops.", type: "danger", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50/80" },
        ].map((alert, i) => (
          <div key={i} className={`${alert.bg} backdrop-blur-sm p-6 rounded-[2rem] border border-white/50 flex gap-4 card-shadow`}>
            <div className={`${alert.color} mt-1`}><alert.icon className="w-6 h-6" /></div>
            <div className="space-y-1">
              <h4 className="font-black text-stone-900">{alert.title}</h4>
              <p className="text-sm text-stone-600 leading-relaxed">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans safe-top safe-bottom relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1920&q=80" 
          alt="Farming Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />
      </div>

      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-white/40 backdrop-blur-xl z-40 border-b border-white/20">
        {activeFeature ? (
          <button 
            onClick={() => setActiveFeature(null)}
            className="p-3 bg-agri-soft text-agri-green rounded-2xl active:scale-90 transition-all"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
        ) : (
          <div className="w-12 h-12 bg-agri-green rounded-2xl flex items-center justify-center shadow-lg shadow-agri-green/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
        )}
        <h1 className="text-xl font-black tracking-tight text-stone-900">
          {activeFeature ? activeFeatureData?.name : "Smart Agri AI"}
        </h1>
        <div className="flex gap-2">
          <button onClick={() => setLanguage(language === 'en' ? 'hi' : language === 'hi' ? 'te' : 'en')} className="p-3 bg-stone-100 rounded-2xl text-[10px] font-black uppercase">
            {language}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 relative z-10">
        <AnimatePresence mode="wait">
          {activeFeature ? (
            <motion.div
              key="tool"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pb-24"
            >
              {activeFeatureData && <activeFeatureData.component language={language} />}
            </motion.div>
          ) : (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {currentTab === 'home' && renderHome()}
              {currentTab === 'tools' && renderHome()}
              {currentTab === 'alerts' && renderAlerts()}
              {currentTab === 'profile' && (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                  <User className="w-20 h-20 mb-4 opacity-20" />
                  <p className="font-bold">Farmer Profile Coming Soon</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-xl border-t border-white/20 px-8 py-4 flex justify-between items-center z-50 safe-bottom">
        {[
          { id: 'home', label: t.common.home },
          { id: 'tools', label: t.common.tools },
          { id: 'alerts', label: t.common.alerts },
          { id: 'profile', label: t.common.profile },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setCurrentTab(tab.id as any); setActiveFeature(null); }}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentTab === tab.id && !activeFeature ? 'text-agri-green scale-110' : 'text-stone-300'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
