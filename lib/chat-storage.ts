// Chat storage helper functions for Supabase
import { supabase } from './supabase'

export interface ChatMessage {
  id?: string
  user_id: string
  farm_id?: string
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  created_at?: string
}

/**
 * Save a chat message to Supabase
 */
export async function saveChatMessage(message: ChatMessage) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: message.user_id,
      farm_id: message.farm_id || null,
      role: message.role,
      content: message.content,
      thinking: message.thinking || null
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving chat message:', error)
    throw error
  }

  return data
}

/**
 * Get chat history for a user and farm
 */
export async function getChatHistory(userId: string, farmId?: string, limit: number = 50) {
  let query = supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit)

  // If farmId is provided, filter by farm_id
  if (farmId) {
    query = query.eq('farm_id', farmId)
  } else {
    // If no farmId, get messages with null farm_id (general chat)
    query = query.is('farm_id', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching chat history:', error)
    throw error
  }

  return data || []
}

/**
 * Delete a specific message
 */
export async function deleteChatMessage(messageId: string, userId: string) {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', messageId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting message:', error)
    throw error
  }
}

/**
 * Delete all chat history for a user
 */
export async function clearChatHistory(userId: string) {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('Error clearing chat history:', error)
    throw error
  }
}

/**
 * Get message count for a user
 */
export async function getMessageCount(userId: string) {
  const { count, error } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error('Error counting messages:', error)
    return 0
  }

  return count || 0
}

