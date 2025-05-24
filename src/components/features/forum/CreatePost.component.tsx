// src/components/features/forum/CreatePost.component.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation"; // added
import { supabase } from "@/helper/supabase.helper";
import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { FileUpload } from "@/ui/FileUpload.ui";
import { Button } from "@/ui/Button.ui";
import { Tag, X } from "@phosphor-icons/react";
import { useAuth } from "@/store/context/Auth.provider";

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface CreatePostProps {
  postId?: string;
  onPostCreated?: () => void;
  onPostUpdated?: () => void;

  initialTitle?: string; // added
  initialContent?: string;
  initialCategory?: string;
  initialTags?: string[];
  initialImages?: string[];
}

export const CreatePost: React.FC<CreatePostProps> = ({
  postId,
  onPostCreated,
  onPostUpdated,
  initialTitle = "", // added
  initialContent = "",
  initialCategory = "",
  initialTags = [],
  initialImages = [],
}) => {
  const router = useRouter(); // added for Cancel
  const { auth } = useAuth();
  if (auth.isLoading || !auth.user) return null;

  // --- State ---
  const [title, setTitle] = useState(initialTitle); // added
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [allImages, setAllImages] = useState<(File | string)[]>([...initialImages]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // enum lists & helpers
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // --- Load draft if no initialContent ---
  useEffect(() => {
    if (!initialContent) {
      const draft = localStorage.getItem("create-post-draft");
      if (draft) {
        const data = JSON.parse(draft);
        setTitle(data.title || ""); // added
        setContent(data.content || "");
        setTags(data.tags || []);
        setAllImages(data.allImages || []);
      }
    }
  }, [initialContent]);

  // --- Fetch categories & tags once ---
  useEffect(() => {
    (async () => {
      const { data: catData } = await supabase.from("categories").select("name");
      setCategoriesList(catData?.map(c => c.name) || []);

      const { data: tagData } = await supabase.from("tags").select("name");
      setTagsOptions(tagData?.map(t => t.name) || []);
    })();
  }, []);

  // --- Save draft on every change ---
  useEffect(() => {
    const draft = {
      title, // added
      content,
      category,
      tags,
      allImages,
    };
    localStorage.setItem("create-post-draft", JSON.stringify(draft));
  }, [title, content, category, tags, allImages]);

  // ... existing handleAddTag, handleRemoveTag, handleImageChange ...
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
      setAllImages(prev => [...prev, file]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // upsert category if needed
    let finalCategory = category;
    if (creatingCategory && newCategory.trim()) {
      const name = newCategory.trim();
      await supabase.from("categories").insert({ name });
      setCategoriesList(prev => [...prev, name]);
      finalCategory = name;
    }

    // upload new files & gather URLs
    const newFiles = allImages.filter(img => img instanceof File) as File[];
    const existingUrls = allImages.filter(img => typeof img === "string") as string[];
    const newUrls = await Promise.all(
      newFiles.map(async file => {
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
    const imageUrls = [...existingUrls, ...newUrls];
    const authorId = auth.user?.id;

    // include title in payload
    const payload = {
      title, // added
      content,
      category: finalCategory,
      tags,
      images: imageUrls,
      author_id: authorId,
      is_deleted: false,
      likes_count: 0,
      comment_count: 0,
    };

    let error;
    if (postId) {
      ({ error } = await supabase.from("posts").update(payload).eq("id", postId));
      if (!error) onPostUpdated?.();
    } else {
      ({ error } = await supabase.from("posts").insert([payload]));
      if (!error) {
        // clear after successful post
        setTitle(""); // added
        setContent("");
        setTags([]);
        setAllImages([]);
        localStorage.removeItem("create-post-draft");
        onPostCreated?.();
      }
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <label htmlFor="post-title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="post-title"
            placeholder="Enter post title"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
            className="w-full rounded border px-3 py-2 focus:ring-primary focus:border-primary"
            maxLength={185}
          />
          <p className="text-xs text-gray-500">{title.length}/185 characters</p>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Content</label>
          <div className="prose dark:prose-invert max-w-none">
            <ReactQuill value={content} onChange={setContent} placeholder="Write your post…" />
          </div>
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

        {/* Images */}
        <FileUpload
          id="post-images"
          label="Add images (optional)"
          accept="image/*"
          onChange={file => file && setAllImages(p => [...p, file])}
        />
        {allImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {allImages.map((img, idx) => (
              <div key={idx} className="relative h-24 w-full overflow-hidden rounded-lg">
                <img
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt={`Preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setAllImages(prev => prev.filter((_, j) => j !== idx))}
                  className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full hover:bg-black/70"
                >
                  <X size={12} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded hover:opacity-95 transition"
          >
            {isSubmitting ? (postId ? "Updating…" : "Posting…") : postId ? "Update Post" : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
