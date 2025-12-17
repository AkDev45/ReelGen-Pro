import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysisResult, ScriptRemixResult, HookAnalysisResult } from "../types";

// Initialize Gemini SDK
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: apiKey });

// Using Gemini 3 Flash Preview for optimized text tasks
const modelId = "gemini-3-flash-preview";

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
    scriptAdjustments: {
      type: Type.OBJECT,
      properties: {
        toAdd: { type: Type.ARRAY, items: { type: Type.STRING } },
        toRemove: { type: Type.ARRAY, items: { type: Type.STRING } },
        tweakLogic: { type: Type.STRING }
      },
      description: "Golden Pro Feature: Specific sentences/concepts to add or remove to maximize retention."
    }
  },
  required: [
    "captions", "hashtags", "postTimes", "storyIdeas", "script", "viralScore",
    "hookStrength", "hookSuggestion", "visualQuality", "audioMood",
    "engagementBait", "keywords", "roast", "bRollSuggestions", "brandDealScout",
    "scriptAdjustments"
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

const hookAnalysisResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Virality score 0-100" },
    critique: { type: Type.STRING, description: "Why the hook is weak or strong" },
    rewrites: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 improved hook rewrites" },
    emotionalTrigger: { type: Type.STRING, description: "The primary emotion (Fear, Curiosity, etc.)" },
    whyItWorks: { type: Type.STRING, description: "Educational explanation of the psychology" }
  },
  required: ["score", "critique", "rewrites", "emotionalTrigger", "whyItWorks"]
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
    6. **Script Doctor (Golden Feature)**: 
       - Identify 3 specific things to **ADD** to the script (missing value, context, emotional cues).
       - Identify 3 specific things to **REMOVE** (fluff, slow intros, jargon).
       - Explain the logic.
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
    
    Provide the same detailed analysis as if you were watching the video.
    
    Crucial: Fill out the 'scriptAdjustments' section with high precision:
    - What specific lines or concepts are missing? (ADD)
    - What is killing retention? (REMOVE)
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

export const analyzeHook = async (hookText: string): Promise<HookAnalysisResult> => {
  const prompt = `
    You are a viral hook expert. Analyze this specific hook text for a short-form video (Reel/TikTok).
    
    Hook: "${hookText}"
    
    1. Score it (0-100).
    2. Critique it briefly (clarity, curiosity gap, emotional pull).
    3. Provide 3 improved versions.
    4. Identify the emotional trigger (Curiosity, Fear, etc.).
    5. Explain WHY it works or fails psychologically.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: hookAnalysisResponseSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No hook analysis generated.");
  return JSON.parse(text) as HookAnalysisResult;
}