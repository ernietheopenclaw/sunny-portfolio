"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={`grid gap-3 mt-6 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className="relative overflow-hidden rounded-lg cursor-pointer group"
            style={{ border: "1px solid var(--border)", aspectRatio: images.length === 1 ? "16/9" : "4/3" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Image ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "rgba(0,0,0,0.2)" }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer"
            style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)" }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 p-2 rounded-full transition-colors cursor-pointer"
                style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)" }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 p-2 rounded-full transition-colors cursor-pointer"
                style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)" }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex]}
            alt={`Image ${activeIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full"
              style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)" }}
            >
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
