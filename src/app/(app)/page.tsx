"use client";

import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  FileText,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultAdmissionsConfig } from "@/config/admissions-config";
import { useApplicationProgress } from "@/hooks/use-application-progress";

export default function Home() {
  const { progress } = useApplicationProgress(defaultAdmissionsConfig);
  const hasStarted = !!progress;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12 md:px-0">
      <div className="w-full max-w-3xl">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f5f5f7]">
            <GraduationCap className="h-10 w-10 text-[#0058cc]" />
          </div>
          <h1 className="mb-3 text-[40px] font-semibold leading-[1.1] tracking-tight text-gray-900">
            Welcome to EnrollAI
          </h1>
          <p className="mx-auto max-w-md text-[17px] leading-[1.47] text-gray-500">
            Apply for your course with help from our friendly AI assistant.
            It will guide you through each step.
          </p>
        </div>

        {/* Apply / Continue CTA */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#0058cc] to-[#00b0ef] p-8 text-center text-white">
          {hasStarted ? (
            <>
              <h2 className="mb-2 text-[22px] font-semibold">
                Continue your application
              </h2>
              <p className="mb-6 text-[15px] text-white/80">
                Pick up where you left off. Your progress has been saved.
              </p>
              <Link href="/apply/chat">
                <Button className="h-14 rounded-xl bg-white px-8 text-[17px] font-semibold text-[#0058cc] shadow-none hover:bg-white/90">
                  Continue Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-[22px] font-semibold">
                Ready to start your application?
              </h2>
              <p className="mb-6 text-[15px] text-white/80">
                Our AI assistant will guide you step by step. Your progress is
                saved, so you can come back anytime.
              </p>
              <Link href="/apply">
                <Button className="h-14 rounded-xl bg-white px-8 text-[17px] font-semibold text-[#0058cc] shadow-none hover:bg-white/90">
                  Start My Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/applications"
            className="flex items-center gap-4 rounded-2xl bg-[#f5f5f7] px-6 py-5 transition-colors hover:bg-[#ececee]"
          >
            <ClipboardList className="h-6 w-6 shrink-0 text-[#0058cc]" />
            <div>
              <p className="text-[15px] font-medium text-gray-900">
                Application Status
              </p>
              <p className="text-[14px] text-gray-500">
                See how your application is going
              </p>
            </div>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-4 rounded-2xl bg-[#f5f5f7] px-6 py-5 transition-colors hover:bg-[#ececee]"
          >
            <FileText className="h-6 w-6 shrink-0 text-[#0058cc]" />
            <div>
              <p className="text-[15px] font-medium text-gray-900">
                Your Profile
              </p>
              <p className="text-[14px] text-gray-500">
                View and update your details
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
