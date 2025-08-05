import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert the File to a Blob for upload
    const blob = new Blob([await audioFile.arrayBuffer()], { 
      type: audioFile.type || "audio/wav" 
    });

    // Upload the file to Gemini
    const uploadedFile = await ai.files.upload({
      file: blob,
      config: { 
        mimeType: audioFile.type || "audio/wav",
        displayName: audioFile.name || "audio_recording"
      },
    });

    // Generate transcription using the proper content creation methods
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: createUserContent([
        createPartFromUri(uploadedFile.uri!, uploadedFile.mimeType!),
        "Generate a transcript of the speech. Return only the transcribed text without any additional commentary or formatting."
      ])
    });

    const transcription = result.text || "";

    // Clean up the uploaded file
    try {
      if (uploadedFile.name) {
        await ai.files.delete({ name: uploadedFile.name });
      }
    } catch (deleteError) {
      console.warn('Failed to delete uploaded file:', deleteError);
    }

    return NextResponse.json({
      transcription: transcription.trim()
    });

  } catch (error) {
    console.error('Error in transcription API:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
