import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Extended type for OpenRouter response with images
interface OpenRouterMessage {
  role: string;
  content: string | null;
  refusal?: string | null;
  images?: Array<{
    type: string;
    image_url: {
      url: string;
    };
    index: number;
  }>;
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://nano-banana.com", // Placeholder
    "X-Title": "Nano Banana", // Placeholder
  },
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, image } = await req.json();

    if (!prompt || !image) {
      return NextResponse.json({ error: 'Missing prompt or image' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: 'Server configuration error: API key missing' }, { status: 500 });
    }

    console.log("Processing image generation request...");
    console.log("Prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "Generate a new image based on the provided image and prompt: " + prompt
            },
            {
              "type": "image_url",
              "image_url": {
                "url": image // Expecting base64 data URL
              }
            }
          ]
        }
      ],
      // @ts-ignore
      extra_body: {
        generationConfig: {
          responseModalities: ["IMAGE"]
        }
      }
    });

    console.log("Full OpenRouter Response:", JSON.stringify(completion, null, 2));

    let result = completion.choices[0].message.content;

    // Check if image data is in the images array (Gemini 2.5 Flash Image format)
    const message = completion.choices[0].message as OpenRouterMessage;
    if (message.images && message.images.length > 0) {
      result = message.images[0].image_url.url;
      console.log("Success: Found image in images array");
    } else if (!result) {
      console.log("Content is null. Checking for refusal or fallback...");
      if (completion.choices[0].message.refusal) {
        result = `Refusal: ${completion.choices[0].message.refusal}`;
      } else {
        result = "No content returned from API. Check server logs for full response.";
      }
    } else if (result.startsWith("data:image")) {
       console.log("Success: Received Base64 Image Data in content");
    } else {
       console.log("Warning: Received text content instead of image data:", result);
    }
    
    return NextResponse.json({ result, full_response: completion });

  } catch (error: any) {
    console.error('Error processing image:', error);
    return NextResponse.json({ 
        error: 'Internal Server Error',
        details: error.message || String(error)
    }, { status: 500 });
  }
}
