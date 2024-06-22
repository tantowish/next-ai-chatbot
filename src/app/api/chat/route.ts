import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
const openai = new OpenAI({
  apiKey: process.env.api_key || '',
});

export async function POST(req: Request) {
    try{
        if(!process.env.api_key){
            return new NextResponse('Missing Openai API Key.', {status: 400})
        }    
        const { messages, data } = await req.json();
        // console.log(data)
    
        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            stream: true,
            messages,
        });
    
        const stream = OpenAIStream(response);
    
        return new StreamingTextResponse(stream);
    } catch(error: any) {
        return new NextResponse(error.message || 'Something went wrong!', {
            status: 500
        })
    }
}