export interface PostTime {
  label: string;
  score: number;
}

export interface BRollSuggestion {
  timestamp: string;
  suggestion: string;
  type: 'Meme' | 'Screenshot' | 'Stock' | 'Text';
}

export interface BrandDealScout {
  niche: string;
  potentialSponsors: string[];
  pitchDraft: string;
}

export interface ScriptImprovement {
  toAdd: string[];
  toRemove: string[];
  tweakLogic: string;
}

export interface AIAnalysisResult {
  captions: string[];
  hashtags: string[];
  postTimes: PostTime[];
  storyIdeas: string[];
  script: string;
  viralScore: number;
  // Analysis Fields
  hookStrength: number;
  hookSuggestion: string;
  visualQuality: string;
  audioMood: string;
  engagementBait: string;
  keywords: string[];
  roast: string;
  // Unique Features
  bRollSuggestions: BRollSuggestion[];
  brandDealScout: BrandDealScout;
  scriptAdjustments: ScriptImprovement;
}

export interface ScriptVariation {
  title: string;
  content: string;
}

export interface ScriptRemixResult {
  originalScript: string;
  variations: ScriptVariation[];
}

export interface ThumbnailConfig {
  layout: string;
  primaryColor: string;
  accentColor: string;
  headline: string;
  subtext: string;
  description: string;
}

export interface ThumbnailGenResult {
  imageUrl: string;
  theme: string;
  config: {
    timestamp: string;
    textOverlay: string;
    layoutDescription: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface HookAnalysisResult {
  score: number;
  critique: string;
  rewrites: string[];
  emotionalTrigger: string;
  whyItWorks: string;
}

export interface VideoState {
  file: File | null;
  url: string | null;
}

export interface ProjectItem {
  id: string;
  title: string;
  date: string;
  type: 'video' | 'script';
  score?: number;
}

export interface AppState {
  video: VideoState;
  analysis: AIAnalysisResult | null;
  remix: ScriptRemixResult | null;
  loading: boolean;
  error: string | null;
  mode: 'analyze' | 'remix';
}