import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, ScriptRemixResult } from "../types";

// Initialize Gemini SDK
// Note: process.env.API_KEY is expected to be available in the environment
// We use a fallback empty string to prevent the app from crashing on load if the key is missing.
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: apiKey });

const modelId = "gemini-2.5-flash"; // Multimodal, fast model suitable for video analysis

export const analyzeVideoContent = async (
  base64Video: string, 
  mimeType: string
): Promise<AIAnalysisResult> => {
  
  if (!apiKey || apiKey.includes("your_google_ai")) {
    throw new Error("API Key is missing. Please add API_KEY to your environment variables.");
  }

  // Define the expected JSON schema for the response
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      captions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 engaging, viral-style captions for the video."
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
        description: "A structured script (Hook, Body, Call to Action) based on the video visual content."
      },
      viralScore: {
        type: Type.NUMBER,
        description: "An estimated viral potential score from 0 to 100."
      },
      hookStrength: {
        type: Type.NUMBER,
        description: "Score from 1-10 on how strong the first 3 seconds are."
      },
      hookSuggestion: {
        type: Type.STRING,
        description: "Specific advice to improve the first 3 seconds to stop the scroll."
      },
      visualQuality: {
        type: Type.STRING,
        description: "Brief critique of lighting, composition, and color."
      },
      audioMood: {
        type: Type.STRING,
        description: "Description of the audio vibe and its suitability."
      },
      engagementBait: {
        type: Type.STRING,
        description: "A specific, slightly controversial or open-ended comment the creator should pin to spark replies."
      },
      keywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "5 SEO keywords to include naturally in the video description text."
      },
      // New Unique Feature 1: Magic B-Roll Director
      bRollSuggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timestamp: { type: Type.STRING, description: "Time format like 0:04" },
            suggestion: { type: Type.STRING, description: "What to overlay (e.g. 'Show screenshot', 'Meme')" },
            type: { type: Type.STRING, enum: ["Meme", "Screenshot", "Stock", "Text"] }
          },
          required: ["timestamp", "suggestion", "type"]
        },
        description: "Identify 2-3 moments where visual interest drops and suggest edits."
      },
      // New Unique Feature 2: Brand Deal Scout
      brandDealScout: {
        type: Type.OBJECT,
        properties: {
          niche: { type: Type.STRING, description: "Specific micro-niche of this content." },
          potentialSponsors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 types of brands that would sponsor this." },
          pitchDraft: { type: Type.STRING, description: "A professional 1-sentence DM pitch to send to these brands." }
        },
        required: ["niche", "potentialSponsors", "pitchDraft"]
      }
    },
    required: ["captions", "hashtags", "postTimes", "storyIdeas", "script", "viralScore", "hookStrength", "hookSuggestion", "visualQuality", "audioMood", "engagementBait", "keywords", "bRollSuggestions", "brandDealScout"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Video
            }
          },
          {
            text: `Analyze this video for social media optimization. 
            
            Focus heavily on:
            1. The "Hook" (First 3 seconds).
            2. Production quality.
            3. Monetization potential (Brand Deal Scout).
            4. Editing improvements (B-Roll Director).
            
            Provide viral captions, hashtags, script structure, story ideas, SEO keywords, posting times, b-roll suggestions, and brand pitch. Output purely in JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error("No response received from AI.");
    }

    const result = JSON.parse(response.text) as AIAnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const remixVideoScript = async (
  base64Video: string,
  mimeType: string
): Promise<ScriptRemixResult> => {
  
  if (!apiKey || apiKey.includes("your_google_ai")) {
    throw new Error("API Key is missing. Please add API_KEY to your environment variables.");
  }

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      originalScript: {
        type: Type.STRING,
        description: "Exact word-for-word transcription of what is spoken in the video."
      },
      variations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The style or angle of this script variation (e.g. 'Punchier', 'Storytelling')" },
            content: { type: Type.STRING, description: "The full script text for this variation." }
          },
          required: ["title", "content"]
        },
        description: "3 distinct script variations."
      }
    },
    required: ["originalScript", "variations"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Video
            }
          },
          {
            text: "Listen to the audio in this video carefully. 1) Transcribe the original spoken script exactly. 2) Create 3 NEW script variations for a creator to re-record this video. The variations should be: 'Concise & Fast', 'Story-Driven/Personal', and 'Controversial/Bold'. Output purely in JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      }
    });

    if (!response.text) {
      throw new Error("No response received from AI.");
    }

    return JSON.parse(response.text) as ScriptRemixResult;

  } catch (error) {
    console.error("Gemini Remix Error:", error);
    throw error;
  }
};