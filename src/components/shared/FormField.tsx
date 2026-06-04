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
      <label className="text-sm font-medium" style={{ color: '#44403C' }}>
        {label}
        {required && <span className="text-red-500 mr-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: '#DC2626' }}>{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-all',
        'border placeholder:text-[#A8A29E]',
        error
          ? 'border-red-400 focus:border-red-500 bg-red-50'
          : 'border-[var(--border)] focus:border-[#C8922A] bg-white',
        className
      )}
      style={{ color: '#1C1917' }}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-all resize-none',
        'border placeholder:text-[#A8A29E]',
        error
          ? 'border-red-400 focus:border-red-500 bg-red-50'
          : 'border-[var(--border)] focus:border-[#C8922A] bg-white',
        className
      )}
      style={{ color: '#1C1917' }}
      rows={3}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  placeholder?: string;
}

export function Select({ error, placeholder, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-all appearance-none',
        'border',
        error
          ? 'border-red-400 focus:border-red-500 bg-red-50'
          : 'border-[var(--border)] focus:border-[#C8922A] bg-white',
        className
      )}
      style={{ color: '#1C1917' }}
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
      className="w-full py-3.5 rounded-2xl text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, #C8922A, #A37520)' }}
    >
      {loading ? 'جاري الحفظ...' : label}
    </button>
  );
}
