import AppShell from "@/components/app/AppShell";
import { DYActivityProvider } from "@/lib/dy-activity";
import { SheetProvider } from "@/lib/app-sheet";
import { MuseProvider } from "@/lib/app-muse";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DYActivityProvider>
      <SheetProvider>
        <MuseProvider>
          <AppShell>{children}</AppShell>
        </MuseProvider>
      </SheetProvider>
    </DYActivityProvider>
  );
}
