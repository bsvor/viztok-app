import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" href="/" />
        </div>
        {children}
      </div>
    </div>
  );
}
