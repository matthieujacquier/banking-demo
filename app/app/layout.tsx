import AppShell from "@/components/app/AppShell";
import { DYActivityProvider } from "@/lib/dy-activity";
import { SheetProvider } from "@/lib/app-sheet";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DYActivityProvider>
      <SheetProvider>
        <AppShell>{children}</AppShell>
      </SheetProvider>
    </DYActivityProvider>
  );
}
