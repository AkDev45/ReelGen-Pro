# ReelGen Pro 🎬

ReelGen Pro is an AI-powered social media content generator designed for creators. Upload a raw video, and instantly generate viral captions, hashtags, scripts, and posting strategies using the power of Google's Gemini 2.5 Flash model.

## Features

- **Video Analysis**: Detailed breakdown of hook strength, visual quality, and audio mood.
- **Viral Content Generation**:
  - 3 engaging caption options.
  - Curated, high-reach hashtags.
  - Posting time recommendations.
- **Script Remixing**: Transcribes your original audio and generates 3 new script variations (Fast, Story-driven, Bold) to help you re-record better content.
- **Monetization Scout**: Identifies your niche and suggests potential brand sponsors with a draft pitch.
- **B-Roll Director**: Suggests specific edits and overlays to improve viewer retention.
- **Reel Gen Roast**: A savage, unfiltered AI critique of your content to keep you humble.

## Tech Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Environment**: Google AI Studio / Client-side rendering

## Setup & Deployment

### Local Development
1. Clone the repository.
2. Create a `.env` file in the root directory:
   ```
   API_KEY=your_google_ai_studio_key
   ```
3. Open `index.html` in a browser or serve via a simple HTTP server.

### Deployment (Render, Vercel, Netlify)

When deploying to platforms like **Render**, you must manually add your API Key in the settings.

1. Go to your Dashboard and select your project.
2. Find the **Environment** or **Environment Variables** tab.
3. Click "Add Environment Variable".
4. Enter the following:
   - **Name** (Key): `API_KEY`
   - **Value**: Your actual Google Gemini API Key (starts with `AIza...`)
5. Save changes and trigger a new deployment.

> **Note**: Since this is a client-side application, the API key will be exposed to the browser. For production apps with sensitive data, consider proxying requests through a backend.

## License

© Social Hubspot. All rights reserved.