import { IblaiProviders } from "@/providers/iblai-providers";
import { Navbar } from "@/components/navbar";
import { HelpButton } from "@/components/admissions/help-button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <IblaiProviders>
      <Navbar />
      <main className="flex flex-1 flex-col bg-[var(--sidebar-bg,#fafbfc)]">
        {children}
      </main>
      <HelpButton />
    </IblaiProviders>
  );
}
