"use client";

import { useState, useRef } from "react";
import { Button } from "./Button.ui";
import { X, File } from "@phosphor-icons/react";

export interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
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
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onChange(selectedFile);
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

    if (e.dataTransfer.files?.length) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      onChange(droppedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
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
          onChange={handleFileChange}
          className="hidden"
          required={required}
        />

        {file ? (
          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex w-full max-w-xs items-center overflow-hidden rounded-md bg-background p-2 text-sm">
              <div className="flex-1 truncate">{file.name}</div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="ml-2 flex-shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Remove file"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ) : (
          <>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <File size={20} className="text-muted-foreground" />
            </div>
            <div className="mb-2 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {accept ? accept.split(",").join(", ") : "Any file format"}
              </p>
            </div>
            <Button
              type="button"
              onClick={handleButtonClick}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Select File
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
