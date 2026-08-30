import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

export type UploadProgress = (progress: number) => void;

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: UploadProgress
): Promise<string> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // File may not exist, ignore error
  }
}

export function generatePath(folder: string, filename: string): string {
  const ext = filename.split(".").pop();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${folder}/${name}.${ext}`;
}
