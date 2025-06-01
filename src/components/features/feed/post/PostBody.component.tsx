// src/components/features/feed/PostBody.component.tsx
import { PostBodyProps } from "@/types/feed/post.type";
import React, { useState, useRef, useEffect } from "react";

export const PostBody: React.FC<PostBodyProps> = ({ title, content, tags, onTagClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // measure overflow once when content changes (when collapsed)
  useEffect(() => {
    if (!expanded && contentRef.current) {
      const el = contentRef.current;
      if (el.scrollHeight > el.clientHeight) {
        setHasOverflow(true);
      }
    }
  }, [content, expanded]);

  return (
    <div className="px-3 pb-3 space-y-1">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

      {/* content + inline “more” */}
      <div
        ref={contentRef}
        className={`prose text-sm text-gray-700 dark:prose-invert dark:text-gray-300 max-w-none relative ${
          expanded ? "" : "line-clamp-3 overflow-hidden"
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {hasOverflow && (
        <button
          onClick={e => {
            e.stopPropagation();
            setExpanded(prev => !prev);
          }}
          className="text-primary text-sm mt-1"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Tags (clickable) */}
      {tags?.length > 0 && (
        <div className="px-3 py-1 flex flex-wrap gap-1">
          {tags.map(tag => (
            <span
              key={tag}
              onClick={e => {
                e.stopPropagation();
                onTagClick?.(tag);
              }}
              className="bg-secondary/10 text-secondary text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
