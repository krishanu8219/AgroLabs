import { supabase } from './supabase';
import type { FarmerProfile, Farm } from './types';

export async function createFarmerProfile(profile: FarmerProfile) {
  const { data, error } = await supabase
    .from('farmer_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error creating farmer profile:', error);
    throw error;
  }

  return data;
}

export async function getFarmerProfile(userId: string) {
  const { data, error } = await supabase
    .from('farmer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error fetching farmer profile:', error);
    throw error;
  }

  return data;
}

export async function createFarm(farm: Farm) {
  const { data, error } = await supabase
    .from('farms')
    .insert(farm)
    .select()
    .single();

  if (error) {
    console.error('Error creating farm:', error);
    throw error;
  }

  return data;
}

export async function getFarms(userId: string) {
  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching farms:', error);
    throw error;
  }

  return data || [];
}

export async function updateFarm(farmId: string, farm: Partial<Farm>) {
  const { data, error } = await supabase
    .from('farms')
    .update(farm)
    .eq('id', farmId)
    .select()
    .single();

  if (error) {
    console.error('Error updating farm:', error);
    throw error;
  }

  return data;
}

export async function deleteFarm(farmId: string) {
  const { error } = await supabase
    .from('farms')
    .delete()
    .eq('id', farmId);

  if (error) {
    console.error('Error deleting farm:', error);
    throw error;
  }
}
