'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function MobileProductGallery({
  frames,
}: {
  frames: string[];
}) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // Map the horizontal swipe to the frame index (0 to 35)
  const frameIndex = useTransform(
    x,
    [-200, 200],
    [35, 0],
    { clamp: true }
  );

  // Update current frame for display
  useEffect(() => {
    const unsubscribe = frameIndex.on('change', (value) => {
      setCurrentFrame(Math.round(value));
    });
    return unsubscribe;
  }, [frameIndex]);

  // Track interaction start
  const handleDragStart = () => {
    setIsDragging(true);
    // Haptic feedback for interaction start
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    trackEvent('mobile_product_interaction', {
      type: '360_rotate_start',
      product: 'obsidian-reserve',
      device_type: isMobile ? 'mobile' : 'tablet',
      haptic_feedback: 'vibrate' in navigator,
    });
  };

  // Track interaction end
  const handleDragEnd = () => {
    setIsDragging(false);
    // Haptic feedback for interaction end
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([10, 5, 10]); // Double vibration pattern
    }
    trackEvent('mobile_product_interaction', {
      type: '360_rotate_end',
      product: 'obsidian-reserve',
      final_frame: currentFrame,
      device_type: isMobile ? 'mobile' : 'tablet',
      haptic_feedback: 'vibrate' in navigator,
    });
  };

  // Preload nearby frames for smoother experience
  useEffect(() => {
    const preloadFrames = [currentFrame - 1, currentFrame, currentFrame + 1].filter(
      frame => frame >= 0 && frame <= 35
    );

    preloadFrames.forEach(frame => {
      const img = new Image();
      img.src = `/images/products/whiskey-reserve/frame-${frame}.webp`;
    });
  }, [currentFrame]);

  if (!isMobile) return null; // Only render on mobile/tablet

  return (
    <div className="w-full overflow-hidden touch-none py-10">

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="relative flex justify-center cursor-grab active:cursor-grabbing"
      >
        <motion.img
          key={currentFrame} // Force re-render on frame change
          src={`/images/products/whiskey-reserve/frame-${currentFrame}.webp`}
          alt={`360° Product View - Frame ${currentFrame + 1}`}
          className="h-[40vh] w-auto drop-shadow-[0_20px_50px_rgba(212,175,55,0.2)] select-none"
          draggable={false}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        />

        {/* Loading indicator */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg"
          >
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </motion.div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Rotate
          </span>
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#D4AF37] rounded-full"
              style={{
                width: useTransform(x, [-200, 200], ['100%', '0%']),
              }}
            />
          </div>
          <span className="text-xs text-[#D4AF37] font-mono">
            {currentFrame + 1}/36
          </span>
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
        <p className="text-xs text-gray-500">
          Swipe to rotate • Tap and drag for smooth interaction
        </p>
      </motion.div>

    </div>
  );
}