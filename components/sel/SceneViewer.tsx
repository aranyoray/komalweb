"use client";

import { useState, useEffect } from "react";

interface SceneViewerProps {
  imageUrl: string | null; // Object URL or fallback path
  caption: string;
  sceneIndex: number;
  totalScenes: number;
  themeAccent: string;
  isLoading: boolean;
  onPlayClick: () => void;
  showPlayButton: boolean;
}

export default function SceneViewer({
  imageUrl,
  caption,
  sceneIndex,
  totalScenes,
  themeAccent,
  isLoading,
  onPlayClick,
  showPlayButton,
}: SceneViewerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: totalScenes }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i <= sceneIndex ? themeAccent : 'transparent',
              border: `2px solid ${i <= sceneIndex ? themeAccent : themeAccent + '40'}`,
              transform: i === sceneIndex ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Image container */}
      <div
        className="relative rounded-[1.5rem] overflow-hidden shadow-2xl"
        style={{ aspectRatio: '4/3' }}
      >
        {/* Loading state: breathing circle */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <div
              className="w-[120px] h-[120px] rounded-full animate-breathe opacity-30"
              style={{ backgroundColor: themeAccent }}
            />
            <p className="mt-6 text-sm font-medium text-gray-400 animate-pulse">
              Creating your story...
            </p>
          </div>
        )}

        {/* Scene image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`Scene ${sceneIndex + 1}: ${caption}`}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded && !isLoading ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        )}

        {/* Fallback if no image */}
        {!imageUrl && !isLoading && (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${themeAccent}20, ${themeAccent}05)` }}
          >
            <p className="text-gray-400 text-lg">Scene {sceneIndex + 1}</p>
          </div>
        )}

        {/* Caption overlay */}
        {caption && imageLoaded && !isLoading && (
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-sm sm:text-base font-medium leading-relaxed">
              {caption}
            </p>
          </div>
        )}

        {/* Play button */}
        {showPlayButton && imageLoaded && !isLoading && (
          <button
            onClick={onPlayClick}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-20"
            aria-label="Show emoji picker"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 4L16 10L6 16V4Z" fill={themeAccent} />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
