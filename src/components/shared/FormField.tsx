'use client';

import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
        {required && <span style={{ color: 'var(--danger)' }} className="mr-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, style, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-all',
        'border',
        className
      )}
      style={{
        background: error ? 'rgba(215,92,92,0.08)' : 'var(--color-bg, #F7F2EC)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border-soft)'}`,
        color: 'var(--text-primary)',
        ...style,
      }}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, style, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-all resize-none',
        'border',
        className
      )}
      style={{
        background: error ? 'rgba(215,92,92,0.08)' : 'var(--color-bg, #F7F2EC)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border-soft)'}`,
        color: 'var(--text-primary)',
        ...style,
      }}
      rows={3}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  placeholder?: string;
}

export function Select({ error, placeholder, className, style, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-all appearance-none',
        'border',
        className
      )}
      style={{
        background: error ? 'rgba(215,92,92,0.08)' : 'var(--color-bg, #F7F2EC)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border-soft)'}`,
        color: 'var(--text-primary)',
        ...style,
      }}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
}

export function SubmitButton({ label, loading, disabled }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full py-3.5 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-50"
      style={{
        background: '#0F1B33',
        color: '#FFFDF8',
        border: '1px solid rgba(15,27,51,0.20)',
      }}
    >
      {loading ? 'جاري الحفظ...' : label}
    </button>
  );
}
