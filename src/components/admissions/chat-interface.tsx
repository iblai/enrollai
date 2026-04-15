"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, Sparkles } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChatWidget } from "@/components/iblai/chat-widget";
import { ProfileDropdown } from "@/components/iblai/profile-dropdown";
import { IblaiNotificationBell } from "@/components/iblai/notification-bell";
import { ProgressTracker, ProgressBar } from "./progress-tracker";
import { useApplicationProgress } from "@/hooks/use-application-progress";
import type { AdmissionsConfig } from "@/config/admissions-config";

interface ChatInterfaceProps {
    config: AdmissionsConfig;
}

export function ChatInterface({ config }: ChatInterfaceProps) {
    const { progress, startApplication, completionPercentage } =
        useApplicationProgress(config);

    // Start application if not already started
    useEffect(() => {
        startApplication();
    }, [startApplication]);

    // Warn before closing/navigating away mid-application
    useEffect(() => {
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            e.preventDefault();
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return (
        <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]">
            {/* Navbar */}
            <header className="sticky top-0 z-50 shrink-0 bg-[#f5f5f7]/80 backdrop-blur-xl backdrop-saturate-[180%]">
                <div className="mx-auto flex h-12 w-full items-center px-4 md:w-[75vw] md:px-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#00b0ef] to-[#0058cc]">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-[14px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                            Application Assistant
                        </span>
                        <span className="text-[12px] text-[#86868b]">
                            /
                        </span>
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-[13px] font-medium text-[#86868b] transition-colors hover:text-[#1d1d1f]"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Back
                        </Link>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <IblaiNotificationBell />
                        <ProfileDropdown />
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-[#86868b] transition-colors hover:text-[#1d1d1f]">
                                    <span className="text-[13px] font-medium">{completionPercentage}%</span>
                                    <Menu className="h-4 w-4" />
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80 overflow-y-auto">
                                    <SheetHeader>
                                        <SheetTitle>Your progress</SheetTitle>
                                    </SheetHeader>
                                    <ProgressTracker
                                        config={config}
                                        progress={progress}
                                        completionPercentage={completionPercentage}
                                    />
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile progress bar */}
            <div className="shrink-0 pb-1 md:hidden">
                <ProgressBar completionPercentage={completionPercentage} />
            </div>

            {/* Content */}
            <div className="flex flex-1 items-stretch justify-center overflow-hidden pb-12">
                <div className="flex w-full gap-4 px-4 md:w-[75vw] md:px-0">
                    {/* Chat widget */}
                    <div className="min-w-0 flex-1 overflow-hidden rounded-[20px] bg-white">
                        <ChatWidget
                            mentorId={config.mentorId}
                            width="100%"
                            height="100%"
                        />
                    </div>

                    {/* Progress sidebar */}
                    <aside className="hidden w-[260px] shrink-0 overflow-y-auto rounded-[20px] bg-white md:block">
                        <ProgressTracker
                            config={config}
                            progress={progress}
                            completionPercentage={completionPercentage}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}
