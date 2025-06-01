// src/components/features/feed/ImageCarousel.component.tsx
import { ImageCarouselProps } from "@/types/storage.type";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";


export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;
    if (deltaX > SWIPE_THRESHOLD && currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    } else if (deltaX < -SWIPE_THRESHOLD && currentIndex < images.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };
  // TODO: copy swipe/arrow/dots preview + fullscreen modal logic here
  return (
    <div className="relative w-full aspect-video">
      {images?.length > 0 && (
        <div
          className="relative w-full aspect-video bg-muted overflow-hidden rounded-lg cursor-zoom-in"
          onClick={e => {
            e.stopPropagation();
            setPreviewIndex(currentIndex);
            setIsPreviewOpen(true);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-contain object-center"
          />
          {/* Prev */}
          {currentIndex > 0 && (
            <button
              onClick={e => {
                e.stopPropagation();
                setCurrentIndex(i => i - 1);
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/50 p-3 rounded-full"
            >
              <CaretLeft size={24} className="text-primary" />
            </button>
          )}
          {/* Next */}
          {currentIndex < images.length - 1 && (
            <button
              onClick={e => {
                e.stopPropagation();
                setCurrentIndex(i => i + 1);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/50 p-3 rounded-full"
            >
              <CaretRight size={24} className="text-primary" />
            </button>
          )}
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={e => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex ? "bg-primary" : "bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image preview modal */}
      {isPreviewOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={e => {
              e.stopPropagation();
              setIsPreviewOpen(false);
            }}
          >
            <button
              className="absolute top-4 right-4 text-white"
              onClick={e => {
                e.stopPropagation();
                setIsPreviewOpen(false);
              }}
            >
              <X size={32} weight="bold" />
            </button>
            <img
              src={images[previewIndex]}
              alt={`Preview ${previewIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>,
          document.body
        )}
    </div>
  );
};
