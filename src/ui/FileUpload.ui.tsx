"use client";

import { useState, useRef } from "react";
import { Button } from "./Button.ui";
import { X, File } from "@phosphor-icons/react";

export interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  onChange: (file: File[]) => void;
  required?: boolean;
  error?: string;
  description?: string;
}

export function FileUpload({
  id,
  label,
  accept,
  onChange,
  required = false,
  error,
}: FileUploadProps) {
  const MAX_BYTES = 5 * 1024 * 1024;
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files);
    const valids: File[] = [];
    picked.forEach(f => {
      if (f.size > MAX_BYTES) {
        setLocalError("Each file must be under 5 MB");
        return;
      }
      if (!/^(image|video)\//.test(f.type)) {
        setLocalError("Only images, GIFs, and videos are supported");
        return;
      }
      valids.push(f);
    });
    if (!valids.length) return;
    setLocalError(null);
    const next = [...files, ...valids];
    setFiles(next);
    onChange(next);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!e.dataTransfer.files?.length) return;
    const dropped = Array.from(e.dataTransfer.files);
    const valids: File[] = [];
    dropped.forEach(f => {
      if (f.size > MAX_BYTES) {
        setLocalError("Each file must be under 5 MB");
        return;
      }
      if (!/^(image|video)\//.test(f.type)) {
        setLocalError("Only images, GIFs, and videos are supported");
        return;
      }
      valids.push(f);
    });
    if (!valids.length) return;
    setLocalError(null);
    const next = [...files, ...valids];
    setFiles(next);
    onChange(next);
  };

  const handleRemove = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange(next);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {(error || localError) && <p className="text-xs text-red-500">{error || localError}</p>}
      </div>

      <div
        className={`relative flex min-h-[120px] w-full flex-col items-center justify-center rounded-md border-2 border-dashed ${
          isDragging
            ? "border-primary bg-primary/5"
            : error
            ? "border-red-500 bg-red-50"
            : "border-border bg-muted/20"
        } p-4 transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileChange}
          className="hidden"
          required={required}
        />

        {files.length ? (
          <div className="flex flex-col gap-2 w-full">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="truncate">{f.name}</div>
                <button onClick={() => handleRemove(i)}>
                  <X size={16} />
                </button>
                <span>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <File size={20} className="text-muted-foreground" />
            </div>
            <div className="mb-2 text-center">
              <p className="text-sm text-muted-foreground">
              <span className="font-medium">Click to upload</span> or drag & drop files
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supported: JPEG, PNG, GIF, MP4 (max 5 MB)
              </p>
            </div>
            <Button
              type="button"
              onClick={handleButtonClick}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Select Files
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
