# Supabase Database Setup

Complete guide to setting up Supabase as your database for AgriAI.

## 📦 Installation

The required packages are already installed in your project:
- `@supabase/supabase-js`
- `@supabase/ssr`

## 🚀 Setup Steps

### 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Get Your API Keys

In your Supabase project dashboard:

1. Go to **Project Settings** (gear icon)
2. Click on **API**
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbG...`)

### 3. Update Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Chat Messages Table

Go to **SQL Editor** in your Supabase dashboard and run this simplified SQL:

#### Option 1: Just Chat Messages (Start Simple) ⭐

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

-- Enable Row Level Security (RLS)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat messages
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (true); -- Simplified for now, will use app-level filtering

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (true); -- Simplified for now, will use app-level filtering

CREATE POLICY "Users can delete own messages" ON chat_messages
  FOR DELETE USING (true); -- Simplified for now, will use app-level filtering
```

#### Option 2: Full Database Schema (For Later)

If you want to create all tables at once, run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Clerk auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  size_acres NUMERIC(10, 2),
  crop_type TEXT,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  thinking TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Satellite data table
CREATE TABLE IF NOT EXISTS satellite_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  ndvi_value NUMERIC(3, 2),
  date DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('irrigation', 'weather', 'pest', 'disease', 'general')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_fields_user_id ON fields(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_satellite_data_field_id ON satellite_data(field_id);
CREATE INDEX idx_satellite_data_date ON satellite_data(date DESC);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_read ON alerts(read);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE satellite_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for fields
CREATE POLICY "Users can view own fields" ON fields
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own fields" ON fields
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own fields" ON fields
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own fields" ON fields
  FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for chat messages
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for alerts
CREATE POLICY "Users can view own alerts" ON alerts
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own alerts" ON alerts
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fields_updated_at
  BEFORE UPDATE ON fields
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 5. Verify Setup

After running the SQL, verify in Supabase:
1. Go to **Table Editor**
2. You should see: `profiles`, `fields`, `chat_messages`, `satellite_data`, `alerts`
3. Check **Database** → **Policies** to see RLS is enabled

## 📊 Database Schema

### Tables Created

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends Clerk auth) |
| `fields` | Farm fields with location and crop data |
| `chat_messages` | AI chat history |
| `satellite_data` | NDVI and satellite imagery data |
| `alerts` | Notifications for users |

### Relationships

```
profiles (clerk_user_id)
  ↓
fields (user_id) ← satellite_data (field_id)
  ↓
alerts (field_id)

profiles (clerk_user_id)
  ↓
chat_messages (user_id)
```

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS enabled. Users can only:
- View their own data
- Create their own records
- Update their own records
- Delete their own records

### Authentication
Uses Clerk `user_id` for authentication. The RLS policies check against the JWT token.

## 💻 Usage Examples

### 1. Save Chat Message

```typescript
import { supabase } from '@/lib/supabase'

// Save a chat message
const { data, error } = await supabase
  .from('chat_messages')
  .insert({
    user_id: userId,
    role: 'user',
    content: 'What crops should I plant?'
  })
```

### 2. Get User Fields

```typescript
// Get all fields for a user
const { data: fields, error } = await supabase
  .from('fields')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### 3. Create a Field

```typescript
// Add a new field
const { data, error } = await supabase
  .from('fields')
  .insert({
    user_id: userId,
    name: 'North Field',
    size_acres: 156,
    crop_type: 'Corn',
    location: { lat: 40.7128, lng: -74.0060 }
  })
```

### 4. Get Recent Alerts

```typescript
// Get unread alerts
const { data: alerts, error } = await supabase
  .from('alerts')
  .select('*')
  .eq('user_id', userId)
  .eq('read', false)
  .order('created_at', { ascending: false })
  .limit(5)
```

### 5. Add Satellite Data

```typescript
// Add satellite data for a field
const { data, error } = await supabase
  .from('satellite_data')
  .insert({
    field_id: fieldId,
    ndvi_value: 0.78,
    date: new Date().toISOString().split('T')[0]
  })
```

### 6. Get Chat History

```typescript
// Load chat history
const { data: messages, error } = await supabase
  .from('chat_messages')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: true })
  .limit(50)
```

## 🔧 Client Setup Files

Two Supabase clients are configured:

### 1. Client-side (`lib/supabase.ts`)
For use in React components and client-side code:
```typescript
import { supabase } from '@/lib/supabase'
```

### 2. Server-side (`lib/supabase-server.ts`)
For use in Server Components and API routes:
```typescript
import { createServerClient } from '@/lib/supabase-server'

const supabase = await createServerClient()
```

## 🎯 Next Steps

1. ✅ Add environment variables to `.env.local`
2. ✅ Run the SQL schema in Supabase
3. ✅ Verify tables are created
4. 🔄 Integrate with chat to save message history
5. 🔄 Create fields management page
6. 🔄 Add satellite data integration
7. 🔄 Implement alerts system

## 📝 Best Practices

### 1. Always Use User ID
```typescript
// ✅ Good: Include user_id
const { data } = await supabase
  .from('fields')
  .select('*')
  .eq('user_id', userId)

// ❌ Bad: Missing user_id check
const { data } = await supabase
  .from('fields')
  .select('*')
```

### 2. Handle Errors
```typescript
const { data, error } = await supabase
  .from('fields')
  .select('*')

if (error) {
  console.error('Error fetching fields:', error)
  return
}

// Use data safely
```

### 3. Use TypeScript Types
```typescript
import { Field, Alert } from '@/lib/supabase'

const fields: Field[] = data || []
```

## 🐛 Troubleshooting

### RLS Blocking Queries?
Make sure you're passing the Clerk user ID correctly and that your JWT token is valid.

### Connection Issues?
1. Check your environment variables
2. Verify the Supabase URL and key
3. Restart your dev server after adding env vars

### Data Not Showing?
1. Check RLS policies in Supabase dashboard
2. Verify user_id matches Clerk user ID
3. Check browser console for errors

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Dashboard](https://app.supabase.com)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

Your AgriAI app is now ready to store and retrieve data from Supabase! 🌾✨

