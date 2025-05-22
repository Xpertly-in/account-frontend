// src/components/features/forum/CreatePost.component.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/helper/supabase.helper";
import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { FileUpload } from "@/ui/FileUpload.ui";
import { Button } from "@/ui/Button.ui";
import { Tag, X } from "@phosphor-icons/react";
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

  // load enums
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

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

  // fetch existing categories & tags
  useEffect(() => {
    (async () => {
      const { data: catData } = await supabase.from("categories").select("name");
      setCategoriesList(catData?.map(c => c.name) || []);
      const { data: tagData } = await supabase.from("tags").select("name");
      setTagsOptions(tagData?.map(t => t.name) || []);
    })();
  }, []);

  // Save draft on change
  useEffect(() => {
    const data = { title, content, tags };
    localStorage.setItem("create-post-draft", JSON.stringify(data));
  }, [title, content, tags]);

  const handleAddTag = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        // upsert tag
        if (!tagsOptions.includes(newTag)) {
          await supabase.from("tags").insert({ name: newTag });
          setTagsOptions(prev => [...prev, newTag]);
        }
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

    // upsert new category
    let finalCategory = category;
    if (creatingCategory && newCategory.trim()) {
      const name = newCategory.trim();
      await supabase.from("categories").insert({ name });
      setCategoriesList(prev => [...prev, name]);
      finalCategory = name;
    }

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
    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        category: finalCategory,
        tags,
        images: imageUrls,
        author_id: authorName,
        is_deleted: false,
        likes_count: 0,
        comment_count: 0,
      },
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

        {/* Category (live-search + create) */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <Input
            placeholder="Type to search or add…"
            list="categories-list"
            value={creatingCategory ? newCategory : category}
            onChange={e => {
              const v = e.currentTarget.value;
              if (categoriesList.includes(v)) {
                setCategory(v);
                setCreatingCategory(false);
              } else {
                setNewCategory(v);
                setCreatingCategory(true);
              }
            }}
            onKeyDown={async e => {
              if (e.key === "Enter" && creatingCategory && newCategory.trim()) {
                e.preventDefault();
                const name = newCategory.trim();
                await supabase.from("categories").upsert({ name });
                setCategoriesList(prev => Array.from(new Set([...prev, name])));
                setCategory(name);
                setNewCategory("");
                setCreatingCategory(false);
              }
            }}
            className="w-full rounded border px-2 py-1"
          />
          <datalist id="categories-list">
            <option value="__new">+ Add new category</option>
            {categoriesList.map(c => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <div
                key={tag}
                className="flex items-center gap-1 bg-primary text-white px-2 py-1 rounded-full text-xs"
              >
                <Tag size={12} weight="bold" />
                <span>{tag}</span>
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  className="p-0.5 hover:bg-primary/80 rounded-full"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X size={12} weight="bold" />
                </button>
              </div>
            ))}
          </div>
          <Input
            list="tags-list"
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={e => setTagInput(e.currentTarget.value)}
            onKeyDown={handleAddTag}
          />
          <datalist id="tags-list">
            {tagsOptions.map(t => (
              <option key={t} value={t} />
            ))}
          </datalist>
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
