import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface RequestBody {
  initialPrompt: string;
  messages: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { initialPrompt, messages } = body;

    // Validate that we have either an initial prompt or messages
    if (!initialPrompt
    ) {
      return NextResponse.json(
        { error: 'The initialPrompt must be provided' },
        { status: 400 }
      );
    }

    // Always include the initial prompt as the first message to maintain context
    // followed by any conversation messages
    let contents = [{
      role: 'user',
      parts: [{ text: initialPrompt }]
    }];

    // Add the conversation messages after the initial prompt
    if (messages.length > 0) {
      const conversationContents = messages.map(message => ({
        role: message.role,
        parts: [{ text: message.content }]
      }));
      contents = contents.concat(conversationContents);
    }

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
