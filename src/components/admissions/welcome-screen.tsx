"use client";

import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Camera,
  FileText,
  PenLine,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/iblai/profile-dropdown";
import { IblaiNotificationBell } from "@/components/iblai/notification-bell";
import type { AdmissionsConfig } from "@/config/admissions-config";

interface WelcomeScreenProps {
  config: AdmissionsConfig;
  onStart: () => void;
}

const checklist = [
  { icon: Camera, text: "Photo ID (passport, driving licence, or national ID)" },
  { icon: FileText, text: "Qualification certificates (GCSEs, A-Levels, or equivalent)" },
  { icon: PenLine, text: "Personal statement (we will help you write this)" },
  { icon: Briefcase, text: "CV if you have one (optional)" },
];

export function WelcomeScreen({ config, onStart }: WelcomeScreenProps) {
  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]">
      {/* Top bar */}
      <header className="mx-auto flex w-full shrink-0 items-center justify-between px-4 py-3 md:w-[75vw] md:px-0">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#86868b] transition-colors hover:text-[#1d1d1f]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <IblaiNotificationBell />
          <ProfileDropdown />
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00b0ef] to-[#0058cc] shadow-lg shadow-[#0058cc]/20">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>

        <h1 className="mb-2 text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary,#111827)] sm:text-[40px]">
          {config.welcomeTitle}
        </h1>

        <p className="mb-6 text-[15px] leading-[1.47] tracking-[-0.01em] text-[var(--text-secondary,#616a76)]">
          {config.welcomeDescription}
        </p>

        <div className="mb-6 w-full rounded-2xl bg-white p-4 text-left shadow-sm shadow-black/[0.03]">
          <p className="mb-3 text-[13px] font-semibold tracking-[-0.01em] text-[var(--text-secondary,#616a76)] uppercase">
            What you will need
          </p>
          <div className="flex flex-col gap-2.5">
            {checklist.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#0058cc]" />
                <span className="text-[14px] leading-[1.43] tracking-[-0.01em] text-[var(--text-primary,#111827)]">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={onStart}
          className="h-14 w-full rounded-xl bg-gradient-to-r from-[#0058cc] to-[#00b0ef] px-8 text-[17px] font-semibold tracking-[-0.01em] text-white shadow-lg shadow-[#0058cc]/20 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-[#0058cc]/25 active:scale-[0.98] sm:w-auto sm:min-w-[280px]"
        >
          Start My Application
        </Button>

        <p className="mt-4 text-[13px] leading-[1.43] tracking-[-0.01em] text-[var(--text-muted,#9ca3af)]">
          Your progress is saved automatically. Come back anytime.
        </p>
      </div>
      </div>
    </div>
  );
}
