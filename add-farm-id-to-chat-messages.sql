-- Add farm_id column to chat_messages table for farm-specific chats
ALTER TABLE chat_messages 
ADD COLUMN farm_id UUID REFERENCES farms(id) ON DELETE CASCADE;

-- Add index for better performance when querying by farm_id
CREATE INDEX idx_chat_messages_farm_id ON chat_messages(farm_id);

-- Add index for combined user_id and farm_id queries
CREATE INDEX idx_chat_messages_user_farm ON chat_messages(user_id, farm_id);
