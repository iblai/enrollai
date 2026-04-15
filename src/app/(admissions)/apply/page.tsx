"use client";

import { useRouter } from "next/navigation";
import { defaultAdmissionsConfig } from "@/config/admissions-config";
import { WelcomeScreen } from "@/components/admissions/welcome-screen";

export default function ApplyPage() {
  const router = useRouter();

  return (
    <WelcomeScreen
      config={defaultAdmissionsConfig}
      onStart={() => router.push("/apply/chat")}
    />
  );
}
