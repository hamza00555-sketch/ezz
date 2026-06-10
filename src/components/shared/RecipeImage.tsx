'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { dishGradient, getDishImage } from '@/lib/dishImages';

interface RecipeImageProps {
  /** Stored imageUrl: remote https URL, /library-path, linear-gradient, or undefined */
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

function resolveUrl(imageUrl: string | undefined, name: string): string | undefined {
  // Legacy idb: refs are no longer supported (images now live in Supabase Storage).
  if (!imageUrl || imageUrl.startsWith('idb:')) return getDishImage(name);
  return imageUrl;
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
    () => resolveUrl(imageUrl, name)
  );

  useEffect(() => {
    setDisplayUrl(resolveUrl(imageUrl, name));
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
