import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-light/70 mb-1.5">{label}</label>
      )}
      <input
        className={`w-full bg-white/5 border ${
          error ? "border-red-500" : "border-white/10 focus:border-cyan"
        } text-light placeholder:text-light/30 rounded-lg px-4 py-3 text-sm outline-none transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
