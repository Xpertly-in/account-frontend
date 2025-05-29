// src/components/features/forum/CommentForm.component.tsx
"use client";
import React, { useState } from "react";
import { uploadImages } from "@/services/storage.service";
import { Button } from "@/ui/Button.ui";

interface Props {
  parent_id?: number;
  onSubmit: (content: string, images: string[]) => void;
}
export const CommentForm: React.FC<Props> = ({ parent_id, onSubmit }) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [posting, setPosting] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    let urls: string[] = [];
    if (files) urls = await uploadImages(Array.from(files), `comments`);
    await onSubmit(content, urls);
    setContent("");
    setFiles(null);
    setPosting(false);
  };

  return (
    <form onSubmit={handle} className="space-y-2">
      <textarea
        className="w-full border rounded p-2"
        rows={2}
        placeholder={parent_id ? "Write a reply…" : "Write a comment…"}
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <input type="file" multiple onChange={e => setFiles(e.target.files)} />
      <Button type="submit" disabled={posting || !content.trim()}>
        {posting ? "Posting…" : parent_id ? "Reply" : "Comment"}
      </Button>
    </form>
  );
};