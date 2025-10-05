# Clerk Authentication Setup Guide

## 🔐 Setting Up Clerk Authentication

Follow these steps to complete the Clerk authentication setup for your AgroLabs app:

### 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application (choose "Next.js" as your framework)

### 2. Get Your API Keys

1. In your Clerk dashboard, go to **API Keys**
2. You'll see two keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_...`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_...`)

### 3. Create `.env.local` File

Create a file named `.env.local` in the root of your project with the following content:

```bash
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs (these are already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Replace** `pk_test_your_key_here` and `sk_test_your_key_here` with your actual keys from the Clerk dashboard.

### 4. Configure Clerk Dashboard

In your Clerk dashboard, configure the following:

1. **Paths**: Go to **Paths** in the sidebar
   - Set "Sign in" to `/sign-in`
   - Set "Sign up" to `/sign-up`
   - Set "After sign in" to `/dashboard`
   - Set "After sign up" to `/dashboard`

2. **Application URL**: Make sure your application URL is set correctly:
   - Development: `http://localhost:3000`
   - Production: Your production URL

### 5. Run Your Application

```bash
npm run dev
```

Visit `http://localhost:3000` and you should see:
- Landing page with "Sign In" and "Get Started" buttons
- Click either button to authenticate with Clerk
- After signing in, you'll be redirected to `/dashboard`

## 🎯 Features Implemented

### Authentication
- ✅ Clerk authentication integration
- ✅ Protected routes (dashboard requires authentication)
- ✅ Sign in/Sign up modals
- ✅ User profile management with UserButton
- ✅ Automatic redirect to dashboard after login

### Pages
- ✅ **Landing Page** (`/`) - Beautiful marketing page with features
- ✅ **Dashboard** (`/dashboard`) - Main dashboard with stats and overview
- ✅ **AI Chat** (`/dashboard/chat`) - AI assistant chat interface

### Security
- ✅ Middleware protection for dashboard routes
- ✅ Public routes: `/`, `/sign-in`, `/sign-up`
- ✅ All other routes require authentication

## 🚀 Next Steps

1. **Customize the Dashboard**: Add real data and integrations
2. **Implement AI Chat**: Connect to your AI backend/API
3. **Add Satellite Data Integration**: Connect to satellite imagery APIs
4. **Create Additional Pages**: Fields management, analytics, settings
5. **Connect to Supabase**: Set up your database for storing user data

## 📝 Notes

- The `.env.local` file is git-ignored for security
- Never commit your secret keys to version control
- For production, use environment variables in your hosting platform
- Clerk provides built-in email/password, OAuth, and more authentication options

## 🔗 Useful Links

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js + Clerk Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Dashboard](https://dashboard.clerk.com)

---

**Next:** See `PERPLEXITY_SETUP.md` for setting up the AI chat functionality.

