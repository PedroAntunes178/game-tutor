import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Convert messages to the format expected by the Gemini API
    const contents = messages.map(message => ({
      role: message.role,
      parts: [{ text: message.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemma-3n-e4b-it",
      contents: contents
    });

    const text = response.text;

    return NextResponse.json({
      content: text
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
