// src/components/features/forum/CreatePost.component.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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

// // Dynamically import the CSS
// const ReactQuill = dynamic(() => import('react-quill/dist/quill.snow.css'), {
//   ssr: false,
// });

interface CreatePostProps {
  postId?: string;
  onPostCreated?: () => void;
  onPostUpdated?: () => void;
  initialContent?: string;
  initialCategory?: string;
  initialTags?: string[];
  initialImages?: string[];
}

export const CreatePost: React.FC<CreatePostProps> = ({
  postId,
  onPostCreated,
  onPostUpdated,
  initialContent = "",
  initialCategory = "",
  initialTags = [],
  initialImages = [],
}) => {
  const { auth } = useAuth();
  // don't render form until we know who's logged in
  if (auth.isLoading || !auth.user) return null;
  // initialize editor with initialContent if provided
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [tags, setTags] = useState<string[]>(initialTags);
  // merge existing URLs & newly added Files into one list
  const [allImages, setAllImages] = useState<(File | string)[]>([...initialImages]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // load enums
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // only load draft if no initialContent from feed
  useEffect(() => {
    if (!initialContent) {
      const draft = localStorage.getItem("create-post-draft");
      if (draft) {
        const data = JSON.parse(draft);
        setContent(data.content || "");
        setTags(data.tags || []);
      }
    }
  }, [initialContent]);

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
    const data = { content, category, tags, allImages };
    localStorage.setItem("create-post-draft", JSON.stringify(data));
  }, [content, category, tags, allImages]);

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

    // upsert new category
    let finalCategory = category;
    if (creatingCategory && newCategory.trim()) {
      const name = newCategory.trim();
      await supabase.from("categories").insert({ name });
      setCategoriesList(prev => [...prev, name]);
      finalCategory = name;
    }

    // 1) separate existing URLs vs new Files
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

    // derive a display name
    const authorId = auth.user?.id;

    const payload = {
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
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rich text editor for content */}
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

        <FileUpload
          id="post-images"
          label="Upload image"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Preview all (existing URLs + new uploads) */}
        {allImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((img, idx) => (
              <div key={idx} className="relative h-full w-full overflow-hidden rounded-md">
                {typeof img === "string" ? (
                  <img src={img} alt={`Image ${idx + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <img
                    src={URL.createObjectURL(img)}
                    alt={img.name}
                    className="h-full w-full object-cover"
                  />
                )}
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (postId ? "Updating…" : "Posting…") : postId ? "Update Post" : "Post"}
        </Button>
      </form>
    </Card>
  );
};
