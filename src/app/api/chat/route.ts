import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { Game } from "@/types/game";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "your-api-key-here"
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  gameData?: Game;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { messages, gameData } = body;

    // Create the initial system prompt with game information
    let systemPrompt = "";
    if (gameData && messages.length === 1) {
      systemPrompt = `You are an AI tutor for the game "${gameData.name}". Here are the game details:

**Game:** ${gameData.name}
**Description:** ${gameData.description}
**Players:** ${gameData.minPlayers}-${gameData.maxPlayers} players
**Duration:** ${gameData.duration}
**Difficulty:** ${gameData.difficulty}
**Age Range:** ${gameData.ageRange}

**Equipment needed:**
${gameData.equipment.map((item: string) => `• ${item}`).join('\n')}

**Basic Rules:**
${gameData.basicRules.map((rule: string, index: number) => `${index + 1}. ${rule}`).join('\n')}

**Tags:** ${gameData.tags.join(', ')}

You are a friendly, helpful tutor who will guide users through learning this game step by step. Start by welcoming them and offering to teach them how to play. Be engaging, clear, and break down complex concepts into easy-to-understand steps. Ask questions to gauge their understanding and adapt your teaching style accordingly.

---

`;
    }

    // Prepare the conversation content - combine system prompt with first user message
    let conversationContent = "";
    if (systemPrompt && messages.length === 1) {
      conversationContent = systemPrompt + messages[0].content;
    } else {
      // For ongoing conversations, just use the latest message
      conversationContent = messages[messages.length - 1].content;
    }

    const response = await ai.models.generateContent({
      model: "gemma-3n-e4b-it",
      contents: conversationContent
    });

    const text = response.text;

    return NextResponse.json({ 
      content: text,
      role: 'assistant'
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
