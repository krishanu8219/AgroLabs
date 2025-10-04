import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    if (!perplexityApiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 }
      );
    }

    // Add system message for agriculture context
    const systemMessage = {
      role: 'system',
      content: `You are an expert agricultural AI assistant powered by satellite data analysis. 
Your role is to help farmers make informed decisions about their crops, land, and farming practices.
You have access to real-time satellite imagery data and can provide insights on:
- Crop health monitoring (NDVI analysis)
- Irrigation optimization
- Pest and disease detection
- Weather forecasting and planning
- Soil condition assessment
- Yield prediction
- Fertilization recommendations

Provide practical, actionable advice tailored to modern farming practices. 
Be specific, data-driven, and always prioritize sustainable farming methods.
When discussing specific fields or crops, reference satellite data insights when relevant.`
    };

    const allMessages = [systemMessage, ...messages];

    // Prepare request payload
    // Using Sonar Reasoning Pro for advanced agricultural reasoning
    const requestPayload = {
      model: 'sonar-reasoning',
      messages: allMessages,
    };

    console.log('Sending request to Perplexity API:', {
      model: requestPayload.model,
      messageCount: requestPayload.messages.length,
    });

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${perplexityApiKey}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error('Perplexity API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestModel: requestPayload.model,
      });
      
      // Extract error message if available
      const errorMessage = typeof errorData === 'object' && errorData?.error?.message 
        ? errorData.error.message 
        : typeof errorData === 'string' 
        ? errorData 
        : 'Unknown error';
      
      return NextResponse.json(
        { error: `Perplexity API Error (${response.status}): ${errorMessage}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      message: data.choices[0].message.content,
      usage: data.usage,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

