import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { messages, productList } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a world-class Master Sommelier for a luxury spirits brand.
        Your tone is sophisticated, knowledgeable, and helpful.
        Use the following product list to recommend spirits: ${JSON.stringify(productList)}.
        Keep answers concise and focus on flavor notes and food pairings.`,
      },
      ...messages,
    ],
    temperature: 0.7,
  });

  return NextResponse.json(response.choices[0].message);
}