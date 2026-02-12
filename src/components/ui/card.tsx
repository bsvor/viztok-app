import { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-2xl p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
