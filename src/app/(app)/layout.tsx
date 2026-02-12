import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <div className="md:ml-64">
        <TopBar email={user?.email} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
