import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define conversation message type
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { model, prompts, conversationHistory } = data;
    
    if (!model || !prompts || !Array.isArray(prompts)) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.' },
        { status: 401 }
      );
    }

    // Initialize OpenAI client with API key from environment
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log(`Testing ${prompts.length} prompts with model ${model}`);
    
    // Process each prompt in parallel
    const responses = await Promise.all(
      prompts.map(async (prompt, index) => {
        try {
          console.log(`Testing prompt #${index + 1}`);
          
          // Format messages based on whether this is a follow-up or not
          let messages;
          
          if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
            // This is a follow-up question, include conversation history
            console.log(`Processing follow-up conversation with ${conversationHistory.length} previous messages`);
            
            // Convert conversation history to OpenAI format
            messages = conversationHistory.map(msg => ({
              role: msg.role,
              content: msg.content
            }));
            
            // Add the new user prompt
            messages.push({ role: "user", content: prompt });
          } else {
            // This is a new conversation
            messages = [{ role: "user", content: prompt }];
          }
          
          const response = await openai.chat.completions.create({
            model: model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
          });

          const responseContent = response.choices[0].message.content || "No response generated";
          console.log(`Received response for prompt #${index + 1} (${responseContent.length} chars)`);
          
          return {
            prompt,
            response: responseContent
          };
        } catch (error) {
          console.error(`Error processing prompt #${index + 1}: ${prompt.substring(0, 50)}...`, error);
          return {
            prompt,
            response: "Error: Failed to get a response from the model"
          };
        }
      })
    );

    console.log(`Successfully tested ${responses.length} prompts`);
    return NextResponse.json({ results: responses });
  } catch (error) {
    console.error('Error testing prompts:', error);
    return NextResponse.json(
      { error: 'Failed to test prompts' },
      { status: 500 }
    );
  }
} 