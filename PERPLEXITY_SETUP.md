# Perplexity AI Chat Setup Guide

## 🤖 Setting Up Perplexity AI Integration

Your AgroLabs app now has a fully functional AI chat powered by Perplexity AI! Follow these steps to complete the setup.

### 1. Get Your Perplexity API Key

1. Go to [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
2. Sign up or log in to your Perplexity account
3. Navigate to the API section
4. Generate a new API key

### 2. Add API Key to Environment Variables

Add your Perplexity API key to your `.env.local` file:

```bash
# Add this to your .env.local file
PERPLEXITY_API_KEY=pplx-your_api_key_here
```

Replace `pplx-your_api_key_here` with your actual API key from Perplexity.

### 3. Restart Your Development Server

After adding the API key, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then start it again
npm run dev
```

## ✨ Features Implemented

### AI Chat Interface
- ✅ **Real-time Chat**: Interactive chat with Perplexity AI
- ✅ **Agricultural Context**: System prompt tailored for farming assistance
- ✅ **Message History**: Maintains conversation context
- ✅ **Loading States**: Visual feedback during API calls
- ✅ **Error Handling**: Graceful error messages
- ✅ **Suggested Questions**: Pre-populated farming questions
- ✅ **Responsive Design**: Works on all devices
- ✅ **Auto-scroll**: Automatically scrolls to new messages
- ✅ **Timestamp**: Shows when each message was sent

### API Route (`/api/chat`)
- ✅ **Authentication**: Protected with Clerk auth
- ✅ **System Prompt**: Pre-configured for agricultural AI assistance
- ✅ **Model**: Uses `llama-3.1-sonar-small-128k-online` for up-to-date information
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Usage Tracking**: Returns token usage information

### System Prompt Features

The AI assistant is configured with expertise in:
- Crop health monitoring (NDVI analysis)
- Irrigation optimization
- Pest and disease detection
- Weather forecasting and planning
- Soil condition assessment
- Yield prediction
- Fertilization recommendations

## 🚀 How to Use

1. **Navigate to Chat**: Sign in and go to `/dashboard/chat`
2. **Ask Questions**: Type any farming-related question
3. **Use Suggestions**: Click on suggested questions for quick queries
4. **Press Enter**: Hit Enter to send messages (or click the send button)

### Example Questions to Try:

- "What's the current health status of my corn field?"
- "Should I irrigate based on today's satellite imagery?"
- "Are there any pest or disease risks detected?"
- "What's the weather forecast for the next week?"
- "When is the best time to fertilize my crops?"
- "How can I improve my crop yield this season?"

## 🔧 Technical Details

### API Endpoint
- **Route**: `POST /api/chat`
- **Authentication**: Requires Clerk session
- **Request Body**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "Your question here" }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "message": "AI response",
    "usage": { "total_tokens": 150 }
  }
  ```

### Perplexity Model

Using **sonar-reasoning** (Sonar Reasoning Pro):
- Perplexity's advanced reasoning model
- Shows step-by-step thinking process
- Online access: Can search the web for current information
- Optimized for: Complex problem-solving and detailed analysis
- Perfect for agricultural decision-making requiring deep reasoning
- Provides more thorough and well-reasoned responses
- May take slightly longer but delivers higher quality answers

### Files Created

```
app/
├── api/
│   └── chat/
│       └── route.ts          # API route for Perplexity integration
├── dashboard/
    └── chat/
        ├── page.tsx          # Chat page with navigation
        └── chat-client.tsx   # Interactive chat component
```

## 📊 Cost Considerations

Perplexity AI charges based on:
- **Input tokens**: Text you send to the API
- **Output tokens**: Text the API returns
- **Model used**: Different models have different pricing

Check current pricing at: [https://docs.perplexity.ai/docs/pricing](https://docs.perplexity.ai/docs/pricing)

### Cost Optimization Tips:
1. Use concise questions
2. Clear chat history when starting new topics
3. Monitor usage through the API dashboard
4. Set up billing alerts

## 🔐 Security

- ✅ API keys stored in environment variables (not in code)
- ✅ Routes protected with Clerk authentication
- ✅ .env.local files are git-ignored
- ✅ Server-side API calls only (keys never exposed to client)

## 🐛 Troubleshooting

### "API key not configured" error
- Make sure `PERPLEXITY_API_KEY` is in your `.env.local` file
- Restart your development server after adding the key

### "Unauthorized" error
- Make sure you're signed in with Clerk
- Check that middleware is protecting the routes correctly

### API not responding
- Check your Perplexity API key is valid
- Verify you have API credits available
- Check the console for detailed error messages

## 🔗 Useful Links

- [Perplexity AI Documentation](https://docs.perplexity.ai/)
- [Perplexity API Settings](https://www.perplexity.ai/settings/api)
- [Model Information](https://docs.perplexity.ai/docs/model-cards)

## 🎯 Next Steps

1. **Test the Chat**: Ask various farming questions
2. **Customize System Prompt**: Edit the prompt in `app/api/chat/route.ts` for your specific needs
3. **Add Features**: Consider adding:
   - Chat history persistence (save to database)
   - Export conversations
   - Voice input
   - Image analysis for crop photos
   - Field-specific context switching

