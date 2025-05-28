// src/services/storage.service.ts
import { supabase } from "@/helper/supabase.helper";

/**
 * Upload a single file to Supabase Storage and return its public URL
 */
export async function uploadImage(file: File): Promise<string> {
  const ts = Date.now();
  const ext = file.name.split(".").pop();
  const path = `${ts}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("images")
    .upload(path, file, { cacheControl: "3600" });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload multiple files and return array of public URLs
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadImage));
}