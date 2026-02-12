import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

export function Logo({ size = "md", href = "/feed" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`${sizes[size]} font-heading font-bold tracking-tight`}
    >
      <span className="text-cyan">Viz</span>
      <span className="text-light">tok</span>
    </Link>
  );
}
