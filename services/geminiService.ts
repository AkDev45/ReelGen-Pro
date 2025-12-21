
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysisResult, ScriptRemixResult, HookAnalysisResult, ContentGoal } from "../types";

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
    },
    rewrite: {
      type: Type.OBJECT,
      properties: {
        optimizedScript: { type: Type.STRING, description: "The full rewritten script formatted with HOOK, BODY, CTA labels." },
        comparison: {
          type: Type.OBJECT,
          properties: {
            hookStrength: {
              type: Type.OBJECT,
              properties: { original: {type: Type.NUMBER}, optimized: {type: Type.NUMBER} }
            },
            retentionPotential: {
              type: Type.OBJECT,
              properties: { original: {type: Type.NUMBER}, optimized: {type: Type.NUMBER} }
            },
            ctaAlignment: {
              type: Type.OBJECT,
              properties: { original: {type: Type.NUMBER}, optimized: {type: Type.NUMBER} }
            },
            viralPotential: {
              type: Type.OBJECT,
              properties: { original: {type: Type.NUMBER}, optimized: {type: Type.NUMBER} }
            }
          }
        },
        insight: { type: Type.STRING, description: "One-line insight on why this performs better." }
      },
      description: "Golden Pro Feature: Optimized Script Rewrite."
    }
  },
  required: [
    "captions", "hashtags", "postTimes", "storyIdeas", "script", "viralScore",
    "hookStrength", "hookSuggestion", "visualQuality", "audioMood",
    "engagementBait", "keywords", "roast", "bRollSuggestions", "brandDealScout",
    "scriptAdjustments", "rewrite"
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

// --- Helper for Goal Logic ---
const getGoalContext = (goal: ContentGoal) => {
  switch(goal) {
    case 'growth':
      return `
        **GOAL: GROW FOLLOWERS (Reach & Shareability)**.
        - Hook Score: Must be brutal. If it's not broad appeal or shocking, score it low.
        - CTAs: Focus on "Share this" or "Follow for more".
        - Roast: Roast them for being boring or too niche.
        - Monetization: Focus on mass appeal brand deals.
        - Script: Optimize for loops and controversial statements.
      `;
    case 'leads':
      return `
        **GOAL: GET LEADS (Trust & Authority)**.
        - Hook Score: Focus on identifying the target audience's pain point immediately.
        - CTAs: Focus on "Comment [KEYWORD]" automation or "DM me".
        - Roast: Roast them for looking unprofessional or lacking authority.
        - Script: Ensure they demonstrate expertise before asking for the lead.
      `;
    case 'sales':
      return `
        **GOAL: SELL PRODUCT (Urgency & Conversion)**.
        - Hook Score: Must clearly state the benefit/result of the product.
        - CTAs: Focus on "Click the link in bio" or "Grab yours now".
        - Roast: Roast them for not selling hard enough or being too vague about the offer.
        - Script: Use Problem-Agitation-Solution framework.
      `;
    case 'brand':
      return `
        **GOAL: ATTRACT BRANDS (Safety & Quality)**.
        - Hook Score: Focus on visual quality and professional presentation.
        - CTAs: Focus on community engagement.
        - Roast: Roast bad lighting, messy backgrounds, or risky topics that scare sponsors.
        - Monetization: Pitch specifically to high-ticket brands.
      `;
    default:
      return "";
  }
};

// --- Analysis Functions ---

export const analyzeVideoContent = async (base64Video: string, mimeType: string, goal: ContentGoal = 'growth'): Promise<AIAnalysisResult> => {
  const goalContext = getGoalContext(goal);
  const prompt = `
    You are an expert Social Media Strategist. 
    ${goalContext}

    Analyze this video for Instagram Reels / TikTok / YouTube Shorts.
    
    1. **Viral Score**: Rate 0-100 based on the user's specific GOAL defined above.
    2. **Hook**: Critique the first 3s. Provide a specific alternative hook aligned with the GOAL.
    3. **Captions**: Write 3 distinct options tailored to the GOAL.
    4. **Roast**: Be savage, but specifically roast why they won't achieve their GOAL.
    5. **Monetization**: Identify the niche.
    6. **Script Doctor**: Add/Remove elements to specifically achieve the GOAL.

    =====================================
    GOLDEN PRO FEATURE: OPTIMIZED REWRITE
    =====================================
    Rewrite the script to achieve the specific GOAL: ${goal}.

    REWRITE RULES:
    1. HOOK (1-2 lines): Pattern interrupt, Emotion-first, No intro/context.
    2. BODY: Clear progression, One main message, Retention checkpoints, Short-form optimized language.
    3. CTA: Must align with GOAL (${goal}), Natural/Not pushy, Clear next action.

    OPTIMIZATION GOAL:
    - Push script to MAXIMUM ACHIEVABLE VIRAL POTENTIAL.
    - Outperform original.
    - Be believable, sharp, platform-native.

    Provide the 'rewrite' object with:
    - 'optimizedScript': The full text with HOOK / BODY / CTA labels.
    - 'comparison': Score Original vs Optimized (0-10) for Hook Strength, Retention Potential, CTA Alignment, Viral Potential.
    - 'insight': One-line explanation of WHY this version wins for the goal.
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
  const result = JSON.parse(text) as AIAnalysisResult;
  result.goal = goal; // Attach goal to result for UI reference
  return result;
};

export const analyzeScriptContent = async (scriptText: string, goal: ContentGoal = 'growth'): Promise<AIAnalysisResult> => {
  const goalContext = getGoalContext(goal);
  const prompt = `
    You are an expert Script Doctor.
    ${goalContext}
    
    Analyze this script text (or raw idea).
    Script: "${scriptText}"
    
    Provide the same detailed analysis as if you were watching the video.
    Crucial: Fill out the 'scriptAdjustments' section with high precision to help them hit their GOAL.

    =====================================
    GOLDEN PRO FEATURE: OPTIMIZED REWRITE
    =====================================
    Rewrite the script to achieve the specific GOAL: ${goal}.

    REWRITE RULES:
    1. HOOK (1-2 lines): Pattern interrupt, Emotion-first, No intro/context.
    2. BODY: Clear progression, One main message, Retention checkpoints, Short-form optimized language.
    3. CTA: Must align with GOAL (${goal}), Natural/Not pushy, Clear next action.

    OPTIMIZATION GOAL:
    - Push script to MAXIMUM ACHIEVABLE VIRAL POTENTIAL.
    - Outperform original.
    - Be believable, sharp, platform-native.

    Provide the 'rewrite' object with:
    - 'optimizedScript': The full text with HOOK / BODY / CTA labels.
    - 'comparison': Score Original vs Optimized (0-10) for Hook Strength, Retention Potential, CTA Alignment, Viral Potential.
    - 'insight': One-line explanation of WHY this version wins for the goal.
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
  const result = JSON.parse(text) as AIAnalysisResult;
  result.goal = goal;
  return result;
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
