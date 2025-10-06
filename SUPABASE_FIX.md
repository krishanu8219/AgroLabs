# Fix "Failed to save profile" Error

## Problem
The Supabase database doesn't have the required tables (`farmer_profiles`, `farms`, etc.) that the application needs.

## Solution Steps

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Login to your account
3. Select your project: `mrpzvlgkqdbhykoluxbi`

### Step 2: Run the Database Schema

1. In the Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button
3. Open the file `supabase-schema.sql` from your project root
4. Copy ALL the SQL code from that file
5. Paste it into the SQL Editor in Supabase
6. Click **"Run"** button (or press Cmd+Enter)
7. Wait for the success message

### Step 3: Verify Tables Created

1. In the Supabase dashboard, click on **"Table Editor"** in the left sidebar
2. You should now see these tables:
   - `farmer_profiles`
   - `farms`
   - `fields`
   - `chat_messages`
   - `satellite_data`
   - `alerts`

### Step 4: Update Vercel Environment Variables (if needed)

The deployed app is using an old Supabase URL. Update it to match your current one:

```bash
# Run these commands in your terminal:
vercel env rm NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://mrpzvlgkqdbhykoluxbi.supabase.co"

vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHp2bGdrcWRiaHlrb2x1eGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMyMDQsImV4cCI6MjA3NTEzOTIwNH0.uxezojvE0d-blKx9dmfr8CCDGAEM_-rNRkXE0mEVV-I"
```

### Step 5: Redeploy to Vercel

```bash
vercel --prod
```

### Step 6: Test the App

1. Go to your deployed app
2. Sign up or log in
3. Fill in the farmer profile form
4. Click "Continue"
5. It should now work! ✅

## What This Fixes

- ✅ Creates `farmer_profiles` table for user data
- ✅ Creates `farms` table for farm information
- ✅ Creates `fields`, `chat_messages`, `satellite_data`, `alerts` tables
- ✅ Sets up Row Level Security (RLS) for data protection
- ✅ Creates indexes for better performance
- ✅ Adds automatic timestamp updates

## Troubleshooting

### Error: "relation already exists"
This is fine! It means some tables were already created. The SQL uses `IF NOT EXISTS` so it won't break anything.

### Error: "permission denied"
Make sure you're logged in to the correct Supabase project and have admin access.

### Still getting "Failed to save profile"
1. Open browser console (F12)
2. Check for detailed error messages
3. Verify the Supabase URL and anon key are correct in Vercel environment variables
4. Make sure RLS policies are enabled and correct

## Need Help?

If you're still having issues, share:
1. The error message from the browser console (F12 → Console tab)
2. Which step you're stuck on
3. Screenshot of the Supabase Table Editor showing your tables
