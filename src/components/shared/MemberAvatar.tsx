'use client';

const avatarPalette = [
  { bg: 'rgba(201,122,102,0.14)', text: '#C97A66' },
  { bg: 'rgba(15,27,51,0.10)',    text: '#0F1B33'  },
  { bg: 'rgba(114,191,163,0.15)', text: '#4A9E85'  },
  { bg: 'rgba(246,201,178,0.30)', text: '#B8604E'  },
  { bg: 'rgba(209,138,118,0.14)', text: '#D18A76'  },
  { bg: 'rgba(44,62,92,0.10)',    text: '#2C3E5C'  },
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
