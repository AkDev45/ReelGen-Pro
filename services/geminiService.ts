import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, ScriptRemixResult } from "../types";

// Initialize Gemini SDK
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: apiKey });

const modelId = "gemini-2.5-flash"; // Multimodal, fast model suitable for video analysis

// --- Shared Schemas ---

const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    captions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 engaging, viral-style captions."
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "10 relevant, high-reach hashtags."
    },
    postTimes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Day and Time" },
          score: { type: Type.NUMBER, description: "Relevance score 0-1" }
        },
        required: ["label", "score"]
      },
      description: "3 best estimated times to post based on the content vibe."
    },
    storyIdeas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 ideas for Instagram Stories to promote this reel."
    },
    script: {
      type: Type.STRING,
      description: "A structured script (Hook, Body, Call to Action) based on the content."
    },
    viralScore: {
      type: Type.NUMBER,
      description: "An estimated viral potential score from 0 to 100."
    },
    hookStrength: {
      type: Type.NUMBER,
      description: "Score from 1-10 on how strong the hook is."
    },
    hookSuggestion: {
      type: Type.STRING,
      description: "Specific advice to improve the hook."
    },
    visualQuality: {
      type: Type.STRING,
      description: "Critique of visual quality (or suggested visual style for scripts)."
    },
    audioMood: {
      type: Type.STRING,
      description: "Description of the audio vibe (or suggested audio for scripts)."
    },
    engagementBait: {
      type: Type.STRING,
      description: "A specific, slightly controversial or open-ended comment to pin."
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 SEO keywords."
    },
    roast: {
      type: Type.STRING,
      description: "A savage, humorous, slightly mean roast of the content. Max 2 sentences."
    },
    bRollSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING, description: "Time or Section" },
          suggestion: { type: Type.STRING, description: "What to show" },
          type: { type: Type.STRING, enum: ["Meme", "Screenshot", "Stock", "Text"] }
        },
        required: ["timestamp", "suggestion", "type"]
      },
      description: "Identify moments where visual interest drops and suggest edits."
    },
    brandDealScout: {
      type: Type.OBJECT,
      properties: {
        niche: { type: Type.STRING, description: "Specific micro-niche." },
        potentialSponsors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 types of brands." },
        pitchDraft: { type: Type.STRING, description: "A professional 1-sentence DM pitch." }
      },
      required: ["niche", "potentialSponsors", "pitchDraft"]
    }
  },
  required: ["captions", "hashtags", "postTimes", "storyIdeas", "script", "viralScore", "hookStrength", "hookSuggestion", "visualQuality", "audioMood", "engagementBait", "keywords", "roast", "bRollSuggestions", "brandDealScout"]
};

const remixResponseSchema = {
  type: Type.OBJECT,
  properties: {
    originalScript: {
      type: Type.STRING,
      description: "The original script."
    },
    variations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The style or angle of this variation" },
          content: { type: Type.STRING, description: "The full script text." }
        },
        required: ["title", "content"]
      },
      description: "3 distinct script variations."
    }
  },
  required: ["originalScript", "variations"]
};

// --- VIDEO Functions ---

export const analyzeVideoContent = async (
  base64Video: string, 
  mimeType: string
): Promise<AIAnalysisResult> => {
  
  if (!apiKey || apiKey.includes("your_google_ai")) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Video } },
          {
            text: `Analyze this video for social media optimization. 
            Focus on: Hook (First 3s), Production, Monetization, Editing (B-Roll), and a savage Roast.
            Provide viral captions, hashtags, script structure, suggestions, and the roast.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisResponseSchema,
        temperature: 0.7,
      }
    });

    if (!response.text) throw new Error("No response received from AI.");
    return JSON.parse(response.text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Video Analysis Error:", error);
    throw error;
  }
};

export const remixVideoScript = async (
  base64Video: string,
  mimeType: string
): Promise<ScriptRemixResult> => {
  
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Video } },
          {
            text: "Transcribe the audio exactly. Then create 3 NEW script variations: 'Concise & Fast', 'Story-Driven', and 'Controversial'."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: remixResponseSchema,
        temperature: 0.8,
      }
    });

    if (!response.text) throw new Error("No response received from AI.");
    return JSON.parse(response.text) as ScriptRemixResult;

  } catch (error) {
    console.error("Gemini Video Remix Error:", error);
    throw error;
  }
};

// --- SCRIPT / TEXT Functions ---

export const analyzeScriptContent = async (
  scriptText: string
): Promise<AIAnalysisResult> => {
  
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: `Analyze this video SCRIPT for social media optimization.
            
            Script: "${scriptText}"

            Since this is text-only:
            1. Suggest an "Ideal Visual Style" for the visualQuality field.
            2. Suggest "Recommended Audio/Music" for the audioMood field.
            3. Analyze the Hook (first sentence).
            4. Provide B-Roll suggestions based on the text segments.
            5. Provide a savage Roast of the writing style.
            
            Output strictly in JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisResponseSchema, // Reusing the same schema for UI consistency
        temperature: 0.7,
      }
    });

    if (!response.text) throw new Error("No response received from AI.");
    return JSON.parse(response.text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Script Analysis Error:", error);
    throw error;
  }
};

export const remixScriptContent = async (
  scriptText: string
): Promise<ScriptRemixResult> => {
  
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: `Here is a draft script: "${scriptText}"
            
            1. Return the original script in the 'originalScript' field.
            2. Create 3 NEW script variations for a creator to record. The variations should be: 'Concise & Fast', 'Story-Driven/Personal', and 'Controversial/Bold'.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: remixResponseSchema,
        temperature: 0.8,
      }
    });

    if (!response.text) throw new Error("No response received from AI.");
    return JSON.parse(response.text) as ScriptRemixResult;

  } catch (error) {
    console.error("Gemini Script Remix Error:", error);
    throw error;
  }
};