// src/components/features/forum/CreatePost.component.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/helper/supabase.helper";
import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { FileUpload } from "@/ui/FileUpload.ui";
import { Button } from "@/ui/Button.ui";
import { Tag } from "@phosphor-icons/react";
import { useAuth } from "@/store/context/Auth.provider";

interface CreatePostProps {
  onPostCreated?: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { auth } = useAuth();
  // don’t render form until we know who’s logged in
  if (auth.isLoading || !auth.user) return null;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("create-post-draft");
    if (draft) {
      const data = JSON.parse(draft);
      setTitle(data.title || "");
      setContent(data.content || "");
      setTags(data.tags || []);
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    const data = { title, content, tags };
    localStorage.setItem("create-post-draft", JSON.stringify(data));
  }, [title, content, tags]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (remove: string) => {
    setTags(tags.filter(t => t !== remove));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImages(prev => [...prev, file]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: implement actual image uploads and populate `images` field
    // 1) upload each File, collect its public URL
    const imageUrls = await Promise.all(
      images.map(async file => {
        const ts = Date.now();
        const ext = file.name.split(".").pop();
        const path = `${ts}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("images")
          .upload(path, file, { cacheControl: "3600" });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("images").getPublicUrl(path);
        return data.publicUrl;
      })
    );

    // derive a display name
    const authorName = auth.user?.user_metadata?.name ?? auth.user?.email ?? auth.user?.id;

    // 2) insert post record with the image URLs
    const { error } = await supabase
      .from("posts")
      .insert([
        { title, content, tags, images: imageUrls, author_id: authorName, is_deleted: false },
      ]);

    if (error) {
      console.error("Error creating post:", error.message);
    } else {
      // clear form & draft
      setTitle("");
      setContent("");
      setTags([]);
      setImages([]);
      localStorage.removeItem("create-post-draft");
      onPostCreated?.();
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Post title"
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
          required
        />

        <div>
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <p className="text-right text-xs text-gray-500 dark:text-gray-400">
            {content.length}/280
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="bg-primary text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs"
              >
                <Tag size={12} weight="fill" />
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-xs ml-1">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <Input
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={e => setTagInput(e.currentTarget.value)}
            onKeyDown={handleAddTag}
          />
        </div>

        <FileUpload
          id="post-images"
          label="Upload image"
          accept="image/*"
          onChange={handleImageChange}
        />

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((file, idx) => (
              <div key={idx} className="relative h-20 w-full overflow-hidden rounded-md">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Posting…" : "Post"}
        </Button>
      </form>
    </Card>
  );
};
