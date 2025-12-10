# ReelGen Pro 🎬

ReelGen Pro is an AI-powered social media content generator designed for creators. Upload a raw video, and instantly generate viral captions, hashtags, scripts, and posting strategies using the power of Google's Gemini 2.5 Flash model.

## Features

- **Video Analysis**: detailed breakdown of hook strength, visual quality, and audio mood.
- **Viral Content Generation**:
  - 3 engaging caption options.
  - Curated, high-reach hashtags.
  - Posting time recommendations.
- **Script Remixing**: Transcribes your original audio and generates 3 new script variations (Fast, Story-driven, Bold) to help you re-record better content.
- **Monetization Scout**: Identifies your niche and suggests potential brand sponsors with a draft pitch.
- **B-Roll Director**: Suggests specific edits and overlays to improve viewer retention.

## Tech Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Environment**: Google AI Studio / Client-side rendering

## Setup

1. Clone the repository.
2. Create a `.env` file with your API key:
   ```
   API_KEY=your_google_ai_studio_key
   ```
3. Open `index.html` in a browser or serve via a simple HTTP server (e.g., `npx serve`).

## License

© Social Hubspot. All rights reserved.
