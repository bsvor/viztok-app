interface AvatarProps {
  email?: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
};

export function Avatar({ email, size = "md" }: AvatarProps) {
  const initial = email ? email[0].toUpperCase() : "?";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-cyan/20 text-cyan font-semibold flex items-center justify-center`}
    >
      {initial}
    </div>
  );
}
