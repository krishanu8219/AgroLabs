# Complete Supabase Setup Guide for AgroLabs

## Step 1: Create Supabase Account

1. **Go to Supabase**: https://supabase.com
2. **Click "Start your project"** or "Sign Up"
3. **Sign up using**:
   - GitHub account (recommended - easiest)
   - OR Email/Password
4. **Verify your email** if using email signup

---

## Step 2: Create a New Project

1. **Click "New Project"** button
2. **Fill in project details**:
   - **Name**: `agrolabs` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
     - Example: `AgroLabs2025!Secure`
     - ⚠️ **IMPORTANT**: Write this down! You'll need it later
   - **Region**: Choose closest to your users
     - For India: `ap-south-1 (Mumbai)`
     - For US East: `us-east-1 (N. Virginia)`
     - For Europe: `eu-central-1 (Frankfurt)`
   - **Pricing Plan**: Free (good for development)
3. **Click "Create new project"**
4. **Wait 2-3 minutes** for project to be provisioned

---

## Step 3: Get Your API Keys

1. **In your Supabase project dashboard**, click **"Settings"** (gear icon) in the left sidebar
2. **Click "API"** under Settings
3. **Copy these values** (keep them safe!):

   **Project URL:**
   ```
   Example: https://abcdefghijklmnop.supabase.co
   ```

   **anon/public key:** (under "Project API keys")
   ```
   Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **service_role key:** (keep this secret! Don't share)
   ```
   Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Step 4: Create Database Tables

1. **In Supabase dashboard**, click **"SQL Editor"** in the left sidebar
2. **Click "New Query"** button
3. **Copy the SQL below** and paste it into the editor
4. **Click "Run"** (or press Cmd+Enter on Mac, Ctrl+Enter on Windows)
5. **Wait for "Success. No rows returned"** message

```sql
-- AgroLabs Database Schema
-- Run this in your Supabase SQL Editor

-- Create farmer_profiles table
CREATE TABLE IF NOT EXISTS farmer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farms table
CREATE TABLE IF NOT EXISTS farms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  location JSONB NOT NULL,
  crop_type TEXT,
  irrigation_type TEXT,
  size_acres DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fields table
CREATE TABLE IF NOT EXISTS fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  size_acres DECIMAL NOT NULL,
  crop_type TEXT,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  thinking TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create satellite_data table
CREATE TABLE IF NOT EXISTS satellite_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  field_id UUID NOT NULL,
  ndvi_value DECIMAL NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  field_id UUID,
  type TEXT NOT NULL CHECK (type IN ('irrigation', 'weather', 'pest', 'disease', 'general')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user_id ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_satellite_data_field_id ON satellite_data(field_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);

-- Enable Row Level Security (RLS)
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE satellite_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own profile" ON farmer_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON farmer_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON farmer_profiles;
DROP POLICY IF EXISTS "Users can view their own farms" ON farms;
DROP POLICY IF EXISTS "Users can insert their own farms" ON farms;
DROP POLICY IF EXISTS "Users can update their own farms" ON farms;
DROP POLICY IF EXISTS "Users can delete their own farms" ON farms;
DROP POLICY IF EXISTS "Users can view their own fields" ON fields;
DROP POLICY IF EXISTS "Users can insert their own fields" ON fields;
DROP POLICY IF EXISTS "Users can update their own fields" ON fields;
DROP POLICY IF EXISTS "Users can delete their own fields" ON fields;
DROP POLICY IF EXISTS "Users can view their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view satellite data for their fields" ON satellite_data;
DROP POLICY IF EXISTS "Users can view their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON alerts;

-- Create RLS Policies (allow all for anon users - adjust based on your auth setup)
-- For development, we'll allow all operations with anon key
CREATE POLICY "Enable all for authenticated users" ON farmer_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON farms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON satellite_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON alerts FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_farmer_profiles_updated_at ON farmer_profiles;
DROP TRIGGER IF EXISTS update_farms_updated_at ON farms;
DROP TRIGGER IF EXISTS update_fields_updated_at ON fields;

CREATE TRIGGER update_farmer_profiles_updated_at BEFORE UPDATE ON farmer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Step 5: Verify Tables Created

1. **Click "Table Editor"** in the left sidebar
2. **You should see these tables**:
   - ✅ `farmer_profiles`
   - ✅ `farms`
   - ✅ `fields`
   - ✅ `chat_messages`
   - ✅ `satellite_data`
   - ✅ `alerts`

---

## Step 6: Update Local Environment Variables

1. **Open your project** in VS Code
2. **Open the `.env.local` file**
3. **Replace the Supabase values** with your new ones:

```bash
# Clerk Authentication (keep these as is)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZW5oYW5jZWQtcHVwLTgxLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_qfGEfLNChMeYlnQDyxbgpoesjj4yw11PSdAjF3IfrK
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Perplexity AI
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Supabase (REPLACE WITH YOUR NEW VALUES)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Meteomatics (optional - for weather data)
METEOMATICS_USERNAME=your_meteomatics_username
METEOMATICS_PASSWORD=your_meteomatics_password
```

4. **Save the file**

---

## Step 7: Update Vercel Environment Variables

**Open your terminal** and run these commands **one by one**:

### Remove old Supabase variables:
```bash
vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes
```

### Add new Supabase variables:
```bash
# Replace YOUR_PROJECT_REF with your actual project ref (e.g., abcdefghijklmnop)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# When prompted, paste: https://YOUR_PROJECT_REF.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# When prompted, paste your anon key
```

**OR use this faster method:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://YOUR_PROJECT_REF.supabase.co"

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "YOUR_ANON_KEY_HERE"
```

---

## Step 8: Test Locally

1. **In your terminal**, run:
```bash
pnpm run dev
```

2. **Open browser**: http://localhost:3000
3. **Sign up** with a test account
4. **Fill in farmer profile** - it should work now! ✅

---

## Step 9: Deploy to Vercel

```bash
vercel --prod
```

Wait for deployment to complete (2-3 minutes).

---

## Step 10: Test Production

1. **Go to your live site**: https://agrolabs.vercel.app (or your custom domain)
2. **Sign up** or **log in**
3. **Complete onboarding** - fill in farmer profile and farm details
4. **Success!** 🎉

---

## 🎯 Quick Checklist

- [ ] Created Supabase account
- [ ] Created new Supabase project
- [ ] Copied Project URL and anon key
- [ ] Ran SQL schema in Supabase SQL Editor
- [ ] Verified tables exist in Table Editor
- [ ] Updated `.env.local` with new Supabase credentials
- [ ] Updated Vercel environment variables
- [ ] Tested locally - profile saves successfully
- [ ] Deployed to Vercel production
- [ ] Tested production - onboarding works

---

## 🆘 Troubleshooting

### "Failed to save profile" still appears:
1. **Open browser console** (F12 → Console tab)
2. **Look for Supabase errors**
3. **Check if tables exist** in Supabase Table Editor
4. **Verify environment variables** are correct in Vercel

### "Invalid API key" error:
- Double-check you copied the **anon** key (not service_role key)
- Make sure there are no extra spaces or quotes

### Tables not showing in Table Editor:
- Re-run the SQL schema in SQL Editor
- Check for SQL errors in the output

### Local works but production doesn't:
- Verify Vercel environment variables are set correctly
- Redeploy after updating variables: `vercel --prod`

---

## 📝 Save These Credentials

**Write these down somewhere safe:**

```
Supabase Project Name: _________________
Supabase Project URL: _________________
Supabase Database Password: _________________
Supabase Anon Key: _________________
```

---

**Need help?** Share the error message from browser console (F12) and I'll help you fix it! 🚀
