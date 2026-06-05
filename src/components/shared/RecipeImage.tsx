'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { resolveImage, isIdbRef } from '@/lib/imageStore';
import { dishGradient, getDishImage } from '@/lib/dishImages';

interface RecipeImageProps {
  /** Stored imageUrl: idb: ref, /path, linear-gradient, or undefined */
  imageUrl?: string;
  /** Used for gradient fallback and library lookup when imageUrl is unset */
  name: string;
  size: number;
  borderRadius?: number;
  border?: string;
  boxShadow?: string;
  fallbackIcon?: ReactNode;
  style?: React.CSSProperties;
}

function getInitialUrl(imageUrl: string | undefined, name: string): string | undefined {
  if (!imageUrl) return getDishImage(name); // library lookup as fallback
  if (isIdbRef(imageUrl)) return undefined; // async — will load in effect
  return imageUrl; // gradient string or regular path
}

export function RecipeImage({
  imageUrl,
  name,
  size,
  borderRadius = 16,
  border,
  boxShadow,
  fallbackIcon,
  style,
}: RecipeImageProps) {
  const [displayUrl, setDisplayUrl] = useState<string | undefined>(
    () => getInitialUrl(imageUrl, name)
  );

  useEffect(() => {
    if (!imageUrl) {
      setDisplayUrl(getDishImage(name));
      return;
    }
    if (!isIdbRef(imageUrl)) {
      setDisplayUrl(imageUrl);
      return;
    }
    let alive = true;
    resolveImage(imageUrl).then((url) => {
      if (alive) setDisplayUrl(url ?? getDishImage(name));
    });
    return () => { alive = false; };
  }, [imageUrl, name]);

  const isGradient = displayUrl?.startsWith('linear-gradient');
  const showImg = !!displayUrl && !isGradient;

  return (
    <div style={{ width: size, height: size, borderRadius, overflow: 'hidden', flexShrink: 0, border, boxShadow, ...style }}>
      {showImg ? (
        <img src={displayUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: (isGradient ? displayUrl : undefined) ?? dishGradient(name), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {fallbackIcon}
        </div>
      )}
    </div>
  );
}
