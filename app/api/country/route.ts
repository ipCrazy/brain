import { NextRequest, NextResponse } from 'next/server';
import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Zod šema za validaciju odgovora
const CountrySchema = z.object({
  name: z.string(),
  capital: z.string(),
  population: z.number(),
  flagColor: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { country } = body;

    if (!country) {
      return NextResponse.json(
        { error: 'Country name is required' },
        { status: 400 }
      );
    }

    // Pozivanje Ollama API-ja sa definisanom šemom
    const response = await ollama.chat({
      model: 'qwen2.5:1.5b', // Zameniti odgovarajućim modelom
      messages: [{ role: 'user', content: `Tell me about ${country}` }],
      format: zodToJsonSchema(CountrySchema),
    });

    // Parsiranje odgovora i validacija sa Zod
    const parsedData = CountrySchema.parse(JSON.parse(response.message.content));

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error fetching data from Ollama:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Ollama' },
      { status: 500 }
    );
  }
}
