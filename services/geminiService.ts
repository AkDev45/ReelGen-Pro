import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysisResult, ScriptRemixResult } from "../types";

// Initialize Gemini SDK
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: apiKey });

const modelId = "gemini-2.5-flash";

// --- Shared Schemas ---

const analysisResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    captions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 engaging, viral-style captions with hooks.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "10-15 high-reach, niche-specific hashtags.",
    },
    postTimes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          score: { type: Type.NUMBER },
        },
      },
      description: "3 best times to post (e.g., 'Mon 6PM') with a score 0-1.",
    },
    storyIdeas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 Instagram Story ideas to promote this reel.",
    },
    script: {
      type: Type.STRING,
      description: "Transcription or structural breakdown of the content.",
    },
    viralScore: {
      type: Type.NUMBER,
      description: "Predicted virality score from 0 to 100.",
    },
    hookStrength: {
      type: Type.NUMBER,
      description: "Score 0-10 for the opening hook.",
    },
    hookSuggestion: {
      type: Type.STRING,
      description: "A specific suggestion to improve the first 3 seconds.",
    },
    visualQuality: {
      type: Type.STRING,
      description: "Brief critique of lighting, framing, and aesthetic.",
    },
    audioMood: {
      type: Type.STRING,
      description: "Description of the audio vibe and music recommendation.",
    },
    engagementBait: {
      type: Type.STRING,
      description: "A controversial or question-based comment to pin.",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 SEO keywords for the description.",
    },
    roast: {
      type: Type.STRING,
      description: "A savage, short, witty roast of the content.",
    },
    bRollSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Meme', 'Screenshot', 'Stock', 'Text'] },
        },
      },
      description: "Suggestions for B-Roll or overlays to improve retention.",
    },
    brandDealScout: {
      type: Type.OBJECT,
      properties: {
        niche: { type: Type.STRING },
        potentialSponsors: { type: Type.ARRAY, items: { type: Type.STRING } },
        pitchDraft: { type: Type.STRING },
      },
      description: "Monetization potential and pitch draft.",
    },
    thumbnailConfig: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING, description: "Short, punchy text for thumbnail (max 5 words)" },
        subtext: { type: Type.STRING, description: "Supporting text or emotional trigger" },
        primaryColor: { type: Type.STRING, description: "Hex code for background/dominant color" },
        accentColor: { type: Type.STRING, description: "Hex code for text/highlight color" },
        layout: { type: Type.STRING, enum: ['Face-Focus', 'Split-Screen', 'Text-Heavy', 'Minimalist'] },
        description: { type: Type.STRING, description: "Visual description of the ideal thumbnail image" },
      },
      description: "Architecture for a high-CTR thumbnail.",
    },
  },
  required: [
    "captions", "hashtags", "postTimes", "storyIdeas", "script", "viralScore",
    "hookStrength", "hookSuggestion", "visualQuality", "audioMood",
    "engagementBait", "keywords", "roast", "bRollSuggestions", "brandDealScout", "thumbnailConfig"
  ],
};

const remixResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    originalScript: { type: Type.STRING },
    variations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
      },
    },
  },
  required: ["originalScript", "variations"],
};

// --- Analysis Functions ---

export const analyzeVideoContent = async (base64Video: string, mimeType: string): Promise<AIAnalysisResult> => {
  const prompt = `
    You are an expert Social Media Strategist and Video Editor for top creators (MrBeast, Alex Hormozi style).
    Analyze this video for Instagram Reels / TikTok / YouTube Shorts.
    
    Provide a brutally honest critique and actionable strategy.
    
    1. **Viral Score**: Rate 0-100 based on retention loops, hook, and value.
    2. **Hook**: Critique the first 3s. Provide a specific alternative hook.
    3. **Captions**: Write 3 distinct options (Storytelling, Educational, Controversial).
    4. **Roast**: Be savage. Roast the lighting, acting, or vibe. Make it funny but true.
    5. **Monetization**: Identify the niche and suggest sponsors. Write a 1-sentence DM pitch.
    6. **Thumbnail Architecture**: Design a high-CTR thumbnail concept. Choose contrasting hex colors (e.g., #FF0000 vs #FFFFFF).
       - Headline: MUST be clickbait but honest.
       - Layout: Choose best fit (Face-Focus, Split-Screen, etc).
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Video } },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisResponseSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No analysis generated.");
  return JSON.parse(text) as AIAnalysisResult;
};

export const analyzeScriptContent = async (scriptText: string): Promise<AIAnalysisResult> => {
  const prompt = `
    You are an expert Script Doctor for viral short-form content.
    Analyze this script text (or raw idea).
    
    Script: "${scriptText}"
    
    Provide the same detailed analysis as if you were watching the video, but focus on the writing, pacing, and hook structure.
    Infer visual opportunities for the 'Visual Quality' and 'B-Roll' sections.
    
    For Thumbnail Architecture: Design a concept that would make someone click this text-based topic.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisResponseSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No analysis generated.");
  return JSON.parse(text) as AIAnalysisResult;
};

export const remixVideoScript = async (base64Video: string, mimeType: string): Promise<ScriptRemixResult> => {
  const prompt = `
    Transcribe the audio from this video exactly.
    Then, create 3 Remix Variations of this script to help the creator re-record it for better performance:
    1. **The Hormozi Hook**: Make it faster, punchier, focused on value per second.
    2. **The Storyteller**: Add an emotional arc or "hero's journey" element.
    3. **The Controversial Take**: Frame it as a "Hot Take" or "Unpopular Opinion" to drive comments.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Video } },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: remixResponseSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No remix generated.");
  return JSON.parse(text) as ScriptRemixResult;
};

export const remixScriptContent = async (scriptText: string): Promise<ScriptRemixResult> => {
  const prompt = `
    Analyze this raw script: "${scriptText}"
    
    1. Return the original script (cleaned up).
    2. Create 3 Remix Variations:
       - **The Hormozi Hook**: Faster, punchier.
       - **The Storyteller**: Emotional arc.
       - **The Controversial Take**: Hot take framing.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: remixResponseSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No remix generated.");
  return JSON.parse(text) as ScriptRemixResult;
};
