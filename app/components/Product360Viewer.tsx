'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

const TOTAL_FRAMES = 36; // Number of images in your 360 folder

export default function Product360Viewer() {
  const [frameIndex, setFrameIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleUpdateFrame = (deltaX: number) => {
    // Sensivity: change 1 frame per 15 pixels of movement
    const sensitivity = 15;
    const frameChange = Math.floor(deltaX / sensitivity);

    let nextFrame = (frameIndex + frameChange) % TOTAL_FRAMES;

    if (nextFrame < 0) nextFrame = TOTAL_FRAMES - 1;

    setFrameIndex(nextFrame);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - startX.current;

    handleUpdateFrame(deltaX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      onMouseDown={(e) => {
        isDragging.current = true;
        startX.current = e.clientX;
        trackEvent('product_interaction', {
          type: '360_rotate',
          product: 'The Obsidian Reserve: 18 Year Single Malt',
        });
      }}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Image Rendering */}
      <img
        src={`/images/products/whiskey-reserve/frame-${frameIndex}.webp`}
        alt="360 Product View"
        className="w-full h-full object-contain pointer-events-none transition-opacity duration-300"
      />

      {/* 360 Indicator Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
        Drag to Rotate 360°
      </div>
    </div>
  );
}