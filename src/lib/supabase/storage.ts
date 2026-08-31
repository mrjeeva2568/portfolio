import { supabase, supabaseStorageBucket } from "./config";

export type UploadProgress = (progress: number) => void;

export async function uploadFile(file: File, path: string, onProgress?: UploadProgress): Promise<string> {
  const { data, error } = await supabase.storage.from(supabaseStorageBucket).upload(path, file, {
    upsert: true,
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total) return;
      const progress = (progressEvent.loaded / progressEvent.total) * 100;
      onProgress?.(progress);
    },
  });

  if (error) throw error;
  const { data: urlData } = supabase.storage.from(supabaseStorageBucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const storagePath = getStoragePathFromUrl(url);
    if (!storagePath) return;

    const { error } = await supabase.storage.from(supabaseStorageBucket).remove([storagePath]);
    if (error) {
      console.warn("Could not remove file from Supabase Storage:", error.message);
    }
  } catch {
    // Ignore missing or invalid file URLs.
  }
}

export function generatePath(folder: string, filename: string): string {
  const ext = filename.split(".").pop();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${folder}/${name}.${ext}`;
}

function getStoragePathFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split("/");
    const publicIndex = segments.indexOf("public");

    if (publicIndex === -1 || publicIndex + 2 >= segments.length) {
      return null;
    }

    const bucketName = segments[publicIndex + 1];
    if (bucketName !== supabaseStorageBucket) {
      return null;
    }

    return segments.slice(publicIndex + 2).join("/");
  } catch {
    return null;
  }
}
