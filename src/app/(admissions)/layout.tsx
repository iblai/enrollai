import { IblaiProviders } from "@/providers/iblai-providers";
import { HelpButton } from "@/components/admissions/help-button";

export default function AdmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IblaiProviders>
      <main className="flex h-[100dvh] flex-col">{children}</main>
      <HelpButton />
    </IblaiProviders>
  );
}
