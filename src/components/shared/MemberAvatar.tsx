'use client';

const avatarPalette = [
  { bg: 'rgba(199,231,123,0.18)', text: '#C7E77B' },
  { bg: 'rgba(125,211,252,0.15)', text: '#7DD3FC' },
  { bg: 'rgba(134,239,172,0.15)', text: '#86EFAC' },
  { bg: 'rgba(249,168,212,0.15)', text: '#F9A8D4' },
  { bg: 'rgba(167,130,255,0.15)', text: '#A782FF' },
  { bg: 'rgba(253,186,116,0.15)', text: '#FDBA74' },
];

function getColor(name: string) {
  return avatarPalette[name.charCodeAt(0) % avatarPalette.length];
}

const sizeDimensions: Record<string, { size: number; font: number; radius: number }> = {
  sm: { size: 28, font: 11, radius: 10 },
  md: { size: 36, font: 13, radius: 12 },
  lg: { size: 48, font: 16, radius: 16 },
};

interface MemberAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MemberAvatar({ name, size = 'md' }: MemberAvatarProps) {
  const color = getColor(name);
  const dim = sizeDimensions[size];
  return (
    <div
      style={{
        width: dim.size, height: dim.size,
        borderRadius: dim.radius,
        background: color.bg,
        color: color.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: dim.font, fontWeight: 700, flexShrink: 0,
      }}
    >
      {name.charAt(0)}
    </div>
  );
}
