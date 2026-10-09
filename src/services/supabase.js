import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ypmcdnywfarjlcuxtamz.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_7ziSnHK9SJwiLyKCPCBWng_QpMNkfVm';

export const AUDIO_BUCKET = import.meta.env.VITE_SUPABASE_AUDIO_BUCKET || 'phonkhub-audio';
export const PROFILE_BUCKET = import.meta.env.VITE_SUPABASE_PROFILE_BUCKET || 'phonkhub-profile';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Upload an Audio file directly to Supabase 'phonkHub-audio' Bucket
 * @param {File} file - Browser File Object
 * @returns {Promise<string>} Public URL of uploaded audio file
 */
export async function uploadAudioToSupabaseClient(file) {
  try {
    const ext = file.name.split('.').pop();
    const fileName = `audio/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(AUDIO_BUCKET)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Supabase Client Audio Upload Error:', err);
    throw err;
  }
}

/**
 * Upload a Profile Image / Avatar directly to Supabase 'phonkhub-profile' Bucket
 * @param {File} file - Browser Image File Object
 * @returns {Promise<string>} Public URL of uploaded profile picture
 */
export async function uploadProfileImageToSupabaseClient(file) {
  try {
    const ext = file.name.split('.').pop();
    const fileName = `avatars/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(PROFILE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(PROFILE_BUCKET)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Supabase Client Profile Image Upload Error:', err);
    throw err;
  }
}

/**
 * Delete Audio File from Supabase 'phonkHub-audio' Bucket
 * @param {String} audioUrl - Public Supabase URL or storage path
 */
export async function deleteAudioFromSupabaseClient(audioUrl) {
  if (!audioUrl || typeof audioUrl !== 'string') return;
  try {
    let filePath = audioUrl;
    if (audioUrl.includes(`/${AUDIO_BUCKET}/`)) {
      filePath = audioUrl.split(`/${AUDIO_BUCKET}/`)[1];
    }
    if (!filePath || filePath.startsWith('synth:')) return;

    await supabase.storage.from(AUDIO_BUCKET).remove([filePath]);
  } catch (err) {
    console.warn('Client Audio Supabase delete error:', err);
  }
}

/**
 * Delete Cover Artwork from Supabase 'phonkhub-profile' Bucket
 * @param {String} coverUrl - Public Supabase URL or storage path
 */
export async function deleteCoverFromSupabaseClient(coverUrl) {
  if (!coverUrl || typeof coverUrl !== 'string') return;
  try {
    let filePath = coverUrl;
    if (coverUrl.includes(`/${PROFILE_BUCKET}/`)) {
      filePath = coverUrl.split(`/${PROFILE_BUCKET}/`)[1];
    }
    if (!filePath || filePath.startsWith('/assets/')) return;

    await supabase.storage.from(PROFILE_BUCKET).remove([filePath]);
  } catch (err) {
    console.warn('Client Cover Supabase delete error:', err);
  }
}
