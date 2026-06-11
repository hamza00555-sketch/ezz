'use client';

/**
 * BrandIcon — renders a monochrome line icon from /brand/icons/ (currentColor SVGs)
 * using a CSS mask so the icon takes any brand color via the `color` prop.
 * Use this instead of emojis anywhere a small symbolic icon is needed.
 */

export type BrandIconName =
  | 'add' | 'attachment' | 'bills' | 'calendar' | 'child' | 'cleaning'
  | 'completed' | 'cooking' | 'dark-mode' | 'delete' | 'domestic-worker'
  | 'edit' | 'electricity' | 'expenses' | 'family-members' | 'files'
  | 'filter' | 'guest' | 'help' | 'home' | 'image' | 'in-progress'
  | 'internet' | 'language' | 'late' | 'laundry' | 'light-mode' | 'logout'
  | 'maintenance' | 'notes' | 'notifications' | 'priority' | 'privacy'
  | 'profile' | 'reminders' | 'reports' | 'requests' | 'search'
  | 'security' | 'settings' | 'shopping-list' | 'subscriptions'
  | 'tasks' | 'time' | 'water';

interface BrandIconProps {
  name: BrandIconName;
  size?: number;
  color?: string;
  className?: string;
}

export function BrandIcon({ name, size = 22, color = 'currentColor', className = '' }: BrandIconProps) {
  const url = `/brand/icons/${name}.svg`;
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        flexShrink: 0,
      }}
    />
  );
}
