// src/services/storage.service.ts
import { supabase } from "@/lib/supabase";

/**
 * Upload a single file to Supabase Storage and return its public URL
 */
export async function uploadImage(file: File, prefix = ""): Promise<string> {
  const ts = Date.now();
  const ext = file.name.split(".").pop();
  const filename = `${ts}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = prefix ? `${prefix}/${filename}` : filename;
  const { error: upErr } = await supabase.storage
    .from("profile-pictures")
    .upload(path, file, { cacheControl: "3600" });
  if (upErr) throw upErr;
  // ← Return the storage path only, not a public URL
  return path;
}

/**
 * Upload multiple files and return array of public URLs
 */
export async function uploadImages(files: File[], prefix = ""): Promise<string[]> {
  return Promise.all(files.map(file => uploadImage(file, prefix)));
}

// ↓ New helper: get a signed URL for one path
export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  // If this is already a URL, just return it unchanged
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

// ↓ New helper: batch-fetch signed URLs
export async function getSignedUrls(paths: string[], expiresIn = 3600): Promise<string[]> {
  return Promise.all(paths.map(p => getSignedUrl(p, expiresIn)));
}

/**
 * Upload CA membership certificate with proper naming convention
 */
export async function uploadCertificate(file: File, profileId: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  
  // Validate file type
  const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];
  if (!ext || !allowedTypes.includes(ext)) {
    throw new Error('Only PDF, JPG, JPEG, and PNG files are allowed for certificates');
  }
  
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Certificate file size must be less than 5MB');
  }
  
  const filename = `membership-certificate.${ext}`;
  const path = `${profileId}/${filename}`;
  
  const { error } = await supabase.storage
    .from("ca-certificates")
    .upload(path, file, { 
      cacheControl: "3600",
      upsert: true // Replace existing file if it exists
    });
    
  if (error) throw error;
  return path;
}

/**
 * Get signed URL for certificate
 */
export async function getCertificateUrl(path: string, expiresIn = 3600): Promise<string> {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const { data, error } = await supabase.storage
    .from("ca-certificates")
    .createSignedUrl(path, expiresIn);
    
  if (error) throw error;
  return data.signedUrl;
}

/**
 * Delete certificate file
 */
export async function deleteCertificate(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from("ca-certificates")
    .remove([path]);
    
  if (error) throw error;
}
