'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-[#0F1B33] text-[#FFFDF8] hover:bg-[#1a2d52] active:bg-[#0a1224] border border-transparent',
  secondary: 'bg-[#F6C9B2] text-[#0F1B33] hover:bg-[#f0b99e] active:bg-[#e8a88a] border border-transparent',
  ghost:     'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-border)] active:bg-[var(--color-accent-soft)] border border-[var(--color-border)]',
  danger:    'bg-[#C97A66] text-white hover:bg-[#b5664e] active:bg-[#a35540] border border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9  px-4  text-sm  gap-1.5 rounded-xl',
  md: 'h-11 px-5  text-base gap-2   rounded-2xl',
  lg: 'h-13 px-6  text-lg  gap-2.5 rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'start',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C97A66] focus-visible:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ fontFamily: '"Cairo", "IBM Plex Sans Arabic", sans-serif' }}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!loading && icon && iconPosition === 'start' && <span className="flex-shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'end' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}
