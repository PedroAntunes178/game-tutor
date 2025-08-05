# Game Tutor 🎮

A modern web application that teaches users how to play common get-together games, icebreaker games, board games, and card games using AI-powered tutorials.

## Features

- **Comprehensive Game Database**: Curated collection of popular games with detailed information
- **AI-Powered Tutorials**: Interactive chat interface powered by Google's Gemini API
- **Smart Filtering**: Search and filter games by category, difficulty, player count, and more
- **Favorites System**: Save and manage your favorite games for quick access
- **Voice Features**: Audio recording and text-to-speech capabilities for enhanced accessibility
- **Sponsored Content**: Featured games and sponsored recommendations
- **Mobile-Friendly**: Responsive design that works perfectly on mobile and desktop
- **Real-time Chat**: Conversational AI that answers questions about game rules and strategies

## Game Categories

- **Card Games**: UNO, Poker, and more
- **Board Games**: Monopoly, and classics
- **Icebreaker Games**: Two Truths and a Lie, Charades
- **Get-Together Games**: Scavenger Hunt, party games, Cassino Madeira

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with PostCSS
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React
- **Markdown**: React Markdown for formatted content
- **Deployment**: Cloudflare Workers with OpenNext
- **TypeScript**: Full type safety throughout the application

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Google AI API key (from [Google AI Studio](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd game-tutor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create an account or sign in
   - Generate an API key
   - Replace `your_gemini_api_key_here` in `.env.local` with your actual key

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Browse Games**: Use the search bar and filters to find games that match your needs
2. **Add to Favorites**: Click the heart icon to save games you want to play later
3. **Start Tutorial**: Click "Start Tutorial" on any game card to begin learning
4. **Chat with AI**: Ask questions about rules, strategies, or variations
5. **Voice Interaction**: Use voice recording to ask questions hands-free
6. **Listen to Responses**: Enable text-to-speech to hear AI responses aloud
7. **Learn Interactively**: Get step-by-step guidance tailored to your questions

## Audio Features

- **Voice Recording**: Record your questions using the microphone for hands-free interaction
- **Speech Transcription**: Audio recordings are automatically transcribed to text
- **Text-to-Speech**: Have AI responses read aloud for better accessibility
- **Multi-modal Learning**: Perfect for visual, auditory, and kinesthetic learners

## Example Questions to Ask

- "How do I set up this game?"
- "What are the basic rules?"
- "Can you explain the scoring system?"
- "What strategies should beginners know?"
- "Are there any variations of this game?"

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/         # Gemini API integration
│   │   └── transcribe/   # Audio transcription endpoint
│   ├── game/[id]/
│   │   └── page.tsx      # Game tutorial page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── ChatInterface.tsx # AI chat component
│   ├── FavoritesBar.tsx  # Favorites management
│   ├── FilterBar.tsx     # Search and filter component
│   ├── GameCard.tsx      # Game display component
│   └── SponsoredBar.tsx  # Sponsored content component
├── data/
│   ├── index.ts          # Game data index file
│   └── games/            # Individual game JSON files
│       ├── uno.json
│       ├── charades.json
│       ├── monopoly.json
│       ├── two-truths-one-lie.json
│       ├── poker.json
│       ├── scavenger-hunt.json
│       └── cassino-madeira.json
├── hooks/
│   ├── useAudioRecording.ts  # Audio recording functionality
│   ├── useFavorites.ts       # Favorites management
│   └── useTTS.ts            # Text-to-speech functionality
└── types/
    └── game.ts           # TypeScript definitions
```

## Adding New Games

To add new games to the database:

1. Create a new JSON file in `src/data/games/` with the following structure:

```json
{
  "id": "unique-game-id",
  "name": "Game Name",
  "category": "card-games|board-games|icebreaker-games|get-together-games",
  "minPlayers": 2,
  "maxPlayers": 8,
  "ageRange": "8+",
  "duration": "30-60 minutes",
  "difficulty": "Easy|Medium|Hard",
  "description": "Brief description of the game",
  "equipment": ["List", "of", "required", "equipment"],
  "basicRules": ["Basic", "rules", "summary"],
  "tags": ["relevant", "tags"]
}
```

2. Update `src/data/index.ts` to import and include the new game in the games array.

## Deployment

### Cloudflare Workers

This project is optimized for Cloudflare Workers deployment:

```bash
npm run deploy
```

You can also preview the deployment locally:

```bash
npm run preview
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Vercel
- Netlify
- AWS Amplify
- Docker containers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new games or improve existing features
4. Test your changes
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the GitHub issues
2. Create a new issue with details
3. Include your environment setup and error messages

---

Made with ❤️ for game enthusiasts everywhere!
