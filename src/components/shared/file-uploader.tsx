"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "./loading-spinner";
import { uploadFile, generatePath, deleteFile } from "@/lib/firebase/storage";
import { validateFileType, validateFileSize, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_RESUME_SIZE } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: "image" | "pdf";
  label?: string;
}

export function FileUploader({ value, onChange, folder, accept = "image", label }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const allowedTypes = accept === "image" ? ALLOWED_IMAGE_TYPES : ["application/pdf"];
  const maxSize = accept === "image" ? MAX_IMAGE_SIZE : MAX_RESUME_SIZE;

  const handleFile = async (file: File) => {
    if (!validateFileType(file, allowedTypes)) {
      toast.error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
      return;
    }
    if (!validateFileSize(file, maxSize)) {
      toast.error(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setProgress(0);
    try {
      const path = generatePath(folder, file.name);
      const url = await uploadFile(file, path, setProgress);
      // clean up old file if replacing
      if (value) await deleteFile(value);
      onChange(url);
      toast.success("File uploaded successfully");
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  };

  const handleRemove = async () => {
    if (value) await deleteFile(value);
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      {value ? (
        <div className="flex items-center gap-3 rounded-md border p-3">
          {accept === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Uploaded file" className="h-14 w-14 rounded object-cover" />
          ) : (
            <FileText className="h-8 w-8 text-muted-foreground" />
          )}
          <span className="flex-1 truncate text-sm text-muted-foreground">{value.split("/").pop()}</span>
          <Button type="button" size="icon" variant="ghost" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {progress !== null ? (
            <>
              <LoadingSpinner size={20} />
              <span>Uploading... {Math.round(progress)}%</span>
            </>
          ) : (
            <>
              {accept === "image" ? <ImageIcon className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
              <span>Click to upload {accept === "image" ? "an image" : "a PDF"}</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept === "image" ? "image/*" : "application/pdf"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
