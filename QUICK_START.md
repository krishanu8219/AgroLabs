# Quick Start - Chat Messages Storage

Get your chat messages saved to Supabase in 5 minutes! 🚀

## 📝 Simple Setup (Chat Only)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: AgroLabs
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for initialization

### Step 2: Get Your API Keys

1. In your project, click **Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these two values:
   - **URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOi...` (long string)

### Step 3: Add Keys to Your App

1. Open your `.env.local` file (create if doesn't exist)
2. Add these lines (replace with your actual values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-actual-key
```

### Step 4: Create the Chat Table

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  thinking TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow users to view, insert, and delete their messages
CREATE POLICY "Enable read access for all users" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON chat_messages
  FOR DELETE USING (true);
```

4. Click **"Run"** (or press `Cmd/Ctrl + Enter`)
5. You should see: "Success. No rows returned"

### Step 5: Verify Table Created

1. Click **Table Editor** (left sidebar)
2. You should see **chat_messages** table
3. It should have columns: `id`, `user_id`, `role`, `content`, `thinking`, `created_at`

### Step 6: Restart Your App

```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

## ✅ You're Done!

Your chat messages will now be automatically saved to Supabase!

## 🧪 Test It

1. Go to your app: `http://localhost:3000`
2. Sign in
3. Go to chat and send a message
4. Check Supabase **Table Editor** → **chat_messages** to see your message saved!

## 📊 What Got Created

### Table: `chat_messages`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique message ID |
| `user_id` | TEXT | Clerk user ID |
| `role` | TEXT | 'user' or 'assistant' |
| `content` | TEXT | Message content |
| `thinking` | TEXT | AI thinking process (optional) |
| `created_at` | TIMESTAMP | When message was sent |

## 🔍 View Your Messages

In Supabase Dashboard:
1. Go to **Table Editor**
2. Click **chat_messages**
3. See all your chat history!

## 🛠️ Enable Chat History (Optional)

Want to load chat history when you open the chat? See the integration example below.

### Load Chat History on Page Load

Update `app/dashboard/chat/chat-client.tsx`:

```typescript
// Add at the top
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'

// Inside the component, add:
const { user } = useUser()

// Load messages on mount
useEffect(() => {
  if (user?.id) {
    loadChatHistory()
  }
}, [user?.id])

const loadChatHistory = async () => {
  if (!user?.id) return
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(50)
  
  if (error) {
    console.error('Error loading chat history:', error)
    return
  }
  
  if (data && data.length > 0) {
    const loadedMessages = data.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      thinking: msg.thinking,
      timestamp: new Date(msg.created_at)
    }))
    setMessages(loadedMessages)
  }
}
```

## 🎯 Next Steps

Once this is working, you can add more tables later:
- Fields management
- Satellite data
- Alerts
- User profiles

See `SUPABASE_SETUP.md` for the full schema.

## ❓ Troubleshooting

### Can't see messages in database?
1. Check your `.env.local` has the correct keys
2. Make sure you restarted the dev server
3. Check browser console for errors

### "No rows returned" but table not showing?
- Refresh the Supabase dashboard page
- Check the SQL ran without errors

### Environment variables not working?
```bash
# Make sure .env.local is in your project root
# Make sure keys don't have quotes
# Restart dev server after adding them
```

## 🎉 Success!

Your chat messages are now persisted in Supabase! Every conversation is saved and can be retrieved later.

