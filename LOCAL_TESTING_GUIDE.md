# 🧪 Local Testing Guide for AgroLabs

## ✅ What's Been Updated:

1. **`.env.local`** - Updated with new Supabase credentials
2. **Clerk Configuration** - Removed custom sign-in/sign-up URLs (using Clerk's built-in modals)
3. **SQL Schema** - Ready to run in Supabase (`supabase-schema-simple.sql`)

---

## 🎯 Step-by-Step Testing Instructions

### Step 1: Set Up Supabase Database (REQUIRED - Do This First!)

1. **Open Supabase SQL Editor**: 
   - Go to: https://supabase.com/dashboard/project/xgtxzxkrpoqrsqcnrbkl/sql
   - Click **"New Query"**

2. **Run the SQL Schema**:
   - Open the file: `supabase-schema-simple.sql`
   - **Copy ALL the code** (Cmd+A, Cmd+C)
   - **Paste it** in the SQL Editor
   - **Click "Run"** (or press Cmd+Enter)
   - Wait for "Success. No rows returned" message

3. **Verify Tables Created**:
   - Go to **"Table Editor"** in Supabase
   - You should see these 6 tables:
     - ✅ `farmer_profiles`
     - ✅ `farms`
     - ✅ `fields`
     - ✅ `chat_messages`
     - ✅ `satellite_data`
     - ✅ `alerts`

---

### Step 2: Start Development Server

```bash
pnpm run dev
```

Wait for: `✓ Ready in X.Xs`

---

### Step 3: Test Authentication & Onboarding

1. **Open Your Browser**:
   - Go to: http://localhost:3000

2. **Click "Get Started"** or **"Sign In"** button
   - A Clerk modal will pop up (NOT a new page)

3. **Sign Up with Google** (Recommended):
   - Click "Continue with Google"
   - Choose your Google account
   - Allow access

   **OR Sign Up with Email**:
   - Enter your email and password
   - Verify email if prompted

4. **Complete Onboarding - Step 1: Farmer Profile**:
   - **First Name**: Enter your first name
   - **Last Name**: Enter your last name
   - **Phone Number**: Enter phone (e.g., 3758832818)
   - **Preferred Language**: Choose language (default: English)
   - Click **"Continue"**

   **Expected Result**: Should move to Step 2 without errors ✅

5. **Complete Onboarding - Step 2: Add Farm** (Optional):
   - Click **"+ Add a Farm"**
   - **Farm Name**: Enter farm name (e.g., "Green Valley Farm")
   - **Farm Location**: Click on map to select location
   - **Crop Type**: Select crop (e.g., Wheat, Rice, Corn)
   - **Irrigation Method**: Select method (e.g., Drip, Sprinkler)
   - Click **"Add Farm"**

   **Expected Result**: Farm should be added to list ✅

6. **Go to Dashboard**:
   - Click **"Continue to Dashboard"**
   - Dashboard should load without errors ✅

---

### Step 4: Verify Data in Supabase

1. **Go to Supabase Table Editor**:
   - https://supabase.com/dashboard/project/xgtxzxkrpoqrsqcnrbkl/editor

2. **Check `farmer_profiles` table**:
   - Click on `farmer_profiles`
   - You should see your profile data with:
     - user_id (from Clerk)
     - first_name
     - last_name
     - phone_number
     - preferred_language

3. **Check `farms` table** (if you added a farm):
   - Click on `farms`
   - You should see your farm data with:
     - user_id
     - name
     - location (JSON with lat/lng)
     - crop_type
     - irrigation_type

---

### Step 5: Test Chat Feature

1. **In the Dashboard**, click **"Chat"** in the sidebar

2. **Ask a farming question**:
   - Example: "What is the best time to plant wheat?"
   - Send the message

3. **Expected Result**:
   - You should see the AI thinking
   - Then get a response from Perplexity AI ✅

---

### Step 6: Browser Console Check

1. **Open Browser Console**:
   - Press `F12` (or `Cmd+Option+I` on Mac)
   - Click on **"Console"** tab

2. **Look for Errors**:
   - ❌ If you see **red error messages**, copy them and share with me
   - ✅ If you see only warnings (yellow), that's okay

---

## 🎉 Success Checklist

- [ ] Supabase SQL schema executed successfully
- [ ] All 6 tables created in Supabase
- [ ] Dev server started without errors
- [ ] Successfully signed up/signed in with Clerk
- [ ] Completed farmer profile (Step 1) without "Failed to save profile" error
- [ ] Added farm successfully (Step 2) - optional
- [ ] Dashboard loads correctly
- [ ] Profile data visible in Supabase `farmer_profiles` table
- [ ] Farm data visible in Supabase `farms` table (if added)
- [ ] Chat feature works and AI responds
- [ ] No errors in browser console

---

## ❌ Common Issues & Solutions

### Issue 1: "Failed to save profile"
**Cause**: Supabase tables not created or RLS policies blocking access

**Solution**:
1. Make sure you ran the SQL schema in Supabase
2. Verify tables exist in Table Editor
3. Check browser console for detailed error message
4. Share the error with me if it persists

---

### Issue 2: Sign-in button doesn't open modal
**Cause**: Clerk configuration issue

**Solution**:
1. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
2. Check `.env.local` has the correct Clerk keys
3. Restart dev server

---

### Issue 3: Page keeps loading after sign-in
**Cause**: Middleware authentication issue (network fetch failure)

**Solution**:
- This should be fixed in production deployment
- For local testing, you might still see some delays
- Wait 30 seconds and try refreshing

---

### Issue 4: Google Maps not showing on farm location picker
**Cause**: Google Maps API key issue

**Solution**:
- This is optional for testing
- You can skip adding a farm for now
- Or manually enter location coordinates

---

## 🚀 Once Everything Works:

**Tell me and I'll help you:**

1. ✅ Commit changes to Git
2. ✅ Push to GitHub repository
3. ✅ Update Vercel production environment variables
4. ✅ Deploy to production
5. ✅ Connect your domain `agrolabs.it`

---

## 📸 What to Share If You Have Issues:

1. **Screenshot of browser console errors** (F12 → Console tab)
2. **Screenshot of Supabase Table Editor** showing your tables
3. **Copy of any error messages** you see on screen
4. **Description of which step failed**

---

## 💡 Tips:

- Use **Chrome** or **Edge** for best compatibility
- Enable **JavaScript** in your browser
- Disable ad blockers if sign-in doesn't work
- Make sure you have a stable internet connection

---

**Ready to test? Start with Step 1 and work through each step!** 🎯

Let me know how it goes or if you encounter any issues! 🚀
