# Troubleshooting Guide

## Chat API Issues

### Error: "Please make sure your Perplexity API key is configured correctly"

This usually means the API key isn't being read properly. Here's how to fix it:

#### Step 1: Verify API Key Exists
Check your `.env.local` file in the root directory:

```bash
cat .env.local | grep PERPLEXITY
```

You should see:
```
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Step 2: Verify API Key Format
- API key should start with `pplx-`
- Should be around 40-50 characters long
- No spaces before or after the key
- No quotes around the key

#### Step 3: Restart Development Server
**This is the most common fix!** Environment variables are only read when the server starts.

```bash
# Stop the server (Ctrl+C in terminal)
# Then start again:
npm run dev
```

#### Step 4: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try sending a message in the chat
4. Look for any error messages

The error message will now show you exactly what went wrong!

#### Step 5: Check Server Logs
Look at your terminal where `npm run dev` is running. You should see detailed error logs if something goes wrong.

### Common Issues and Solutions

#### Issue: "400 Bad Request" or "Invalid model"
**Solution**: The model name in the API request is incorrect
- ✅ Fixed! The app now uses the correct model: `"sonar-reasoning"` (Sonar Reasoning Pro)
- If you modified the code, make sure you're using `model: "sonar-reasoning"` in the API route
- Other available models: `sonar-pro`, `sonar`
- Perplexity API model names change over time; check their documentation for updates

#### Issue: "Invalid API Key"
**Solution**: Your API key might be incorrect or expired
- Go to https://www.perplexity.ai/settings/api
- Generate a new API key
- Replace the old one in `.env.local`
- Restart the server

#### Issue: "Rate Limit Exceeded"
**Solution**: You've hit the API rate limit
- Wait a few minutes
- Check your usage on the Perplexity dashboard
- Consider upgrading your plan

#### Issue: "Network Error" or "fetch failed"
**Solution**: Network connectivity issue
- Check your internet connection
- Try again in a few seconds
- Check if Perplexity API is down: https://status.perplexity.ai

#### Issue: Chat works but responses are slow
**Solution**: This is normal
- Perplexity API can take 5-15 seconds to respond
- The model searches the web for current information
- Larger questions take longer to process

### Testing Your Setup

You can test if the API is working by checking the server logs when you send a message:

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Sign in and go to /dashboard/chat
4. Send a test message
5. Watch the terminal for logs

Expected logs:
- No "Perplexity API error" messages
- Should see successful responses

### Still Not Working?

1. **Double-check .env.local file location**
   - Must be in the root directory (`/Users/harsimran/agai/.env.local`)
   - Not in any subdirectory

2. **Verify file permissions**
   ```bash
   ls -la .env.local
   ```
   Should show read permissions

3. **Check for typos**
   - Variable name must be exactly: `PERPLEXITY_API_KEY`
   - No extra spaces or characters

4. **Test the API key directly**
   You can test if your API key works using curl:
   ```bash
   curl -X POST https://api.perplexity.ai/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_API_KEY_HERE" \
     -d '{
       "model": "llama-3.1-sonar-small-128k-online",
       "messages": [
         {"role": "user", "content": "Hello, how are you?"}
       ]
     }'
   ```

### Need More Help?

1. Check the browser console for detailed error messages
2. Check the server terminal for API errors
3. Verify your Perplexity account has API credits
4. Make sure you're signed in with Clerk (authentication is required)

## Other Common Issues

### "Unauthorized" Error
- Make sure you're signed in with Clerk
- Try signing out and signing back in
- Clear browser cookies and try again

### Clerk Authentication Not Working
- See `CLERK_SETUP.md` for Clerk configuration
- Make sure Clerk keys are in `.env.local`
- Restart the development server

### Page Not Loading
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Restart the server: `npm run dev`

### Build Errors
- Check for TypeScript errors: `npm run build`
- Make sure all dependencies are installed
- Check that all imports are correct

## Environment Variables Checklist

Your `.env.local` should have:
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Perplexity AI
PERPLEXITY_API_KEY=pplx-...
```

Remember: **Always restart the server after changing .env.local!**

