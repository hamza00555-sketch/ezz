'use client';

import { useState, useEffect } from 'react';
import { resolveImage, isIdbRef } from '@/lib/imageStore';
import { dishGradient } from '@/lib/dishImages';

interface RecipeImageProps {
  imageUrl?: string;
  name: string;
  size?: number;
  borderRadius?: number | string;
  style?: React.CSSProperties;
}

export function RecipeImage({ imageUrl, name, size = 56, borderRadius = 16, style }: RecipeImageProps) {
  const [src, setSrc] = useState<string | undefined>(isIdbRef(imageUrl) ? undefined : imageUrl);

  useEffect(() => {
    if (!isIdbRef(imageUrl)) {
      setSrc(imageUrl);
      return;
    }
    let cancelled = false;
    resolveImage(imageUrl).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => { cancelled = true; };
  }, [imageUrl]);

  const isGrad = !src || src.startsWith('linear-gradient');
  const background = isGrad ? (src || dishGradient(name)) : undefined;

  return (
    <div
      style={{
        width: size, height: size, borderRadius, overflow: 'hidden', flexShrink: 0,
        ...style,
      }}
    >
      {!isGrad ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background }} />
      )}
    </div>
  );
}
