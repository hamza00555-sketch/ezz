'use client';

import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  interactive?: boolean;
}

const paddingClasses = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-5',
};

export function Card({
  children,
  padding = 'md',
  elevated = false,
  interactive = false,
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={[
        'rounded-3xl border transition-all duration-150',
        elevated
          ? 'bg-[var(--color-elevated)] shadow-[0_4px_12px_rgba(15,27,51,0.08)] border-[var(--color-border)]'
          : 'bg-[var(--color-surface)] border-[var(--color-border)]',
        interactive
          ? 'cursor-pointer hover:shadow-[0_6px_20px_rgba(15,27,51,0.10)] hover:-translate-y-px active:translate-y-0 active:shadow-none'
          : '',
        paddingClasses[padding],
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}
