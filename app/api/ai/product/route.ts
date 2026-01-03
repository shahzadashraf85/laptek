import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
// NOTE: You need to add GEMINI_API_KEY to your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { action, currentData, category } = await req.json();

        // Fallback for demo if no API key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Missing GEMINI_API_KEY',
                isDemo: true
            });
        }

        let prompt = "";

        if (action === 'optimize_title') {
            prompt = `You are an expert e-commerce SEO specialist. 
            
            Product Category: "${category}"
            Current Title: "${currentData}"
            
            Task: Rewrite this product title to be highly SEO-optimized following these rules:
            1. Include the brand name at the start
            2. Include key specifications (processor, RAM, storage, screen size if applicable)
            3. Include the model number/name
            4. Add 1-2 high-value keywords that customers search for
            5. Keep it under 100 characters
            6. Make it compelling and professional
            7. Use proper capitalization
            
            Format: Return ONLY the optimized title as plain text, no quotes or extra formatting.
            
            Example good title: "Dell XPS 15 9530 Laptop - Intel i9-13900H, 32GB RAM, 1TB SSD, 15.6\" OLED Display"`;

        } else if (action === 'optimize_description') {
            prompt = `You are an expert e-commerce copywriter specializing in SEO-optimized product descriptions.
            
            Product Category: "${category}"
            Product Title: "${currentData}"
            
            Task: Write a compelling, SEO-optimized product description following these rules:
            1. Start with a strong benefit-driven opening sentence
            2. Include 3-5 key features or specifications
            3. Highlight what makes this product stand out
            4. Use power words that drive conversions (premium, professional, powerful, efficient, etc.)
            5. Include relevant keywords naturally
            6. Keep it between 200-400 characters
            7. Make it scannable and easy to read
            8. End with a subtle call-to-action or value proposition
            
            Format: Return ONLY the description as plain text, no quotes or extra formatting.
            
            Example: "Experience unmatched performance with this premium laptop featuring cutting-edge Intel i9 processor and stunning OLED display. Perfect for professionals and creators who demand the best. Includes 32GB RAM for seamless multitasking and 1TB SSD for lightning-fast storage. Sleek design meets powerful performance."`;

        } else if (action === 'smart_autofill') {
            prompt = `You are an expert e-commerce product manager.
            
            Product Category: "${category}"
            User Input: "${currentData}"
            
            Task: Based on the user input, generate a complete product listing.
            Return a JSON object exactly like this:
            {
                "optimized_title": "SEO-friendly title including brand, model, and key specs",
                "short_description": "Compelling 200-400 character sales-oriented description",
                "specs": {
                    "brand": "string",
                    "model_number": "string",
                    "color": "string",
                    "processor_type": "string",
                    "ram_size": number (just the digits, in GB),
                    "ssd_capacity": number (just the digits, in GB),
                    "screen_size": number (in inches),
                    "condition": "Brand New, Open Box, or Refurbished Excellent"
                }
            }
            
            Rules for Title: Include brand, model, CPU, RAM, SSD.
            Rules for Description: Benefit-driven, professional, includes keywords.
            Rules for Specs: Extract accurately from input. If missing, make an educated guess based on model.
            
            Return ONLY the raw JSON.`;
        }

        // Verifed models for this specific API key
        const modelsToTry = [
            "models/gemini-flash-latest",
            "models/gemini-flash-lite-latest",
            "models/gemini-2.0-flash-lite",
            "models/gemini-2.0-flash-exp",
            "models/gemini-2.0-flash",
            "models/gemini-2.5-flash-lite"
        ];

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                console.log(`Success with model: ${modelName}`);
                return NextResponse.json({ success: true, data: text });
            } catch (error: any) {
                console.warn(`Model ${modelName} failed:`, error.message);
                lastError = error;
                // Continue to next model
            }
        }

        // If all models fail, return a helpful error
        throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}. Please verify your API key at https://aistudio.google.com/app/apikey`);

    } catch (error: any) {
        console.error('AI Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
