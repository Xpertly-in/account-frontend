// src/components/features/feed/CommentForm.component.tsx

"use client";
import React, { useState, useRef } from "react";
import { uploadImages } from "@/services/storage.service";
import { Button } from "@/ui/Button.ui";
import { Image, Smiley } from "@phosphor-icons/react";
import EmojiPicker from "emoji-picker-react";
import { CommentFormProps } from "@/types/feed/comment.type";



export const CommentForm: React.FC<CommentFormProps> = ({
  parent_id,
  onSubmit,
  initialContent = "",
  placeholder = "Add a comment…",
  submitLabel = "Comment",
}) => {
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState<FileList | null>(null);
  const [posting, setPosting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    let urls: string[] = [];
    if (files) urls = await uploadImages(Array.from(files), `comments`);
    await onSubmit(content, urls);
    setContent("");
    setFiles(null);
    setPosting(false);
    setExpanded(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const onEmojiClick = (emojiObject: any, event: any) => {
    setContent(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form
      onSubmit={handle}
      className="flex items-center border rounded-full p-2 shadow-sm relative"
    >
      <textarea
        ref={textareaRef}
        className="flex-1 placeholder-gray-500 resize-none overflow-hidden"
        rows={1}
        placeholder={placeholder}
        value={content}
        onChange={handleInput}
        onClick={e => e.stopPropagation()}
        onFocus={() => setExpanded(true)}
        required
      />
      <div className="relative hidden md:flex items-center">
        <Smiley
          size={24}
          className="text-gray-500 mr-2 cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2  overflow-auto bg-white rounded-lg shadow-lg z-10">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              // shrink overall font & emoji size
              //   pickerStyle={{ maxHeight: "240px", fontSize: "12px" }}
              //   emojiSize={18}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>
      <label className="cursor-pointer mr-2">
        <Image size={24} className="text-gray-500 hover:text-gray-700" />
        <input type="file" multiple className="hidden" onChange={e => setFiles(e.target.files)} />
      </label>
      {expanded && (
        <Button
          type="submit"
          onClick={e => e.stopPropagation()}
          disabled={posting || !content.trim()}
          className="bg-blue-500 text-white rounded-full"
        >
          {posting ? `${submitLabel}ing...` : submitLabel}
        </Button>
      )}
    </form>
  );
};
