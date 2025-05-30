// src/components/features/feed/CreatePost.component.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation"; // added
import { createPost, updatePost, PostPayload } from "@/services/posts.service";
import { useCategories, useUpsertCategory } from "@/services/categories.service";
import { useTags, useUpsertTag } from "@/services/tags.service";
import { uploadImages } from "@/services/storage.service";
import { useMutation } from "@tanstack/react-query";
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
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // replace manual effect+state with React-Query hooks:
  const { data: categoriesList = [] } = useCategories();
  const { data: tagsList = [] } = useTags();

  // category/tag mutations
  const upsertCategoryMutation = useUpsertCategory();
  const upsertTagMutation = useUpsertTag();

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
        if (!tagsList.includes(newTag)) {
          await upsertTagMutation.mutateAsync(newTag);
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
      await upsertCategoryMutation.mutateAsync(name);
      finalCategory = name;
    }

    // upload new files & gather URLs
    const newFiles = allImages.filter(img => img instanceof File) as File[];
    const existingUrls = allImages.filter(img => typeof img === "string") as string[];
    // delegate uploads to service
    const newUrls = await uploadImages(newFiles, "forum/post");
    const imageUrls = [...existingUrls, ...newUrls];
    const authorId = auth.user?.id;

    // include title in payload
    const payload = {
      title,
      content,
      category: finalCategory,
      tags,
      images: imageUrls,
      author_id: authorId,
      is_deleted: false,
      reaction_counts: 0,
    };

    const postPayload: PostPayload = {
      title,
      content,
      category: finalCategory,
      tags,
      images: imageUrls,
      author_id: authorId!,
    };

    if (postId) {
      const nowUtc = new Date().toISOString();
      await updatePost(postId, { ...postPayload, updated_at: nowUtc });
      onPostUpdated?.();
    } else {
      await createPost(postPayload);
      // clear draft & UI
      setTitle("");
      setContent("");
      setTags([]);
      setAllImages([]);
      localStorage.removeItem("create-post-draft");
      onPostCreated?.();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-900">
      {/* Header: show Create vs Edit */}
      <header className="px-4 py-3 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold"> {postId ? "Edit Post" : "Create Post"}</h2>
      </header>
      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="text-xs text-gray-500">{title?.length}/185 characters</p>
          </div>

          {/* Content */}
          <div className="border rounded overflow-hidden">
            <ReactQuill value={content} onChange={setContent} placeholder="Write your post…" />
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
                  await upsertCategoryMutation.mutateAsync(name);
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
              {tagsList.map(t => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          {/* Images */}
          <FileUpload
            id="post-images"
            label="Add images (optional)"
            accept="image/*,video/*"
            onChange={files => setAllImages(curr => [...curr, ...files])}
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

          {/* Footer Actions */}
          <div className="px-4 py-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end space-x-2">
            <Button
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              {isSubmitting ? (postId ? "Updating…" : "Posting…") : postId ? "Update Post" : "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
