"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  FileText,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { defaultAdmissionsConfig } from "@/config/admissions-config";
import { useApplicationProgress } from "@/hooks/use-application-progress";

export function StatusDashboard() {
  const config = defaultAdmissionsConfig;
  const {
    progress,
    completionPercentage,
    completedSteps,
    totalSteps,
    cancelApplication,
  } = useApplicationProgress(config);
  const [cancelOpen, setCancelOpen] = useState(false);

  if (!progress) {
    return (
      <div className="mx-auto w-full flex-1 px-4 py-8 md:w-[75vw] md:px-0">
        <div className="rounded-2xl bg-[#f5f5f7] p-12 text-center">
          <GraduationCap className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h2 className="mb-2 text-[22px] font-semibold text-gray-900">
            No application yet
          </h2>
          <p className="mb-6 text-[17px] text-gray-500">
            Start your application and you can track how it is going here.
          </p>
          <Link href="/apply">
            <Button className="h-12 rounded-xl bg-gradient-to-r from-[#0058cc] to-[#00b0ef] px-6 text-[15px] font-semibold text-white shadow-none hover:opacity-90">
              Start Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full flex-1 px-4 py-8 md:w-[75vw] md:px-0">
      {/* Status header */}
      <div className="mb-8 rounded-2xl bg-[#f5f5f7] p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">
                Your Application
              </h1>
              {progress.submitted ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Submitted
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                  In Progress
                </Badge>
              )}
            </div>
            <p className="text-[15px] text-gray-500">
              Started{" "}
              {new Date(progress.startedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          {!progress.submitted && (
            <Link href="/apply/chat">
              <Button className="h-12 rounded-xl bg-gradient-to-r from-[#0058cc] to-[#00b0ef] px-6 text-[15px] font-semibold text-white shadow-none hover:opacity-90">
                Continue Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[14px] font-medium text-gray-500">
              {completedSteps} of {totalSteps} sections done
            </span>
            <span className="text-[14px] font-semibold text-[#0058cc]">
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {config.steps.map((step) => {
          const stepStatus = progress.steps.find((s) => s.stepId === step.id);
          const isCompleted = stepStatus?.completed ?? false;
          const reqCount = step.requirements.length;
          const completedReqs =
            stepStatus?.requirementsCompleted.length ?? 0;

          return (
            <div
              key={step.id}
              className="flex items-center gap-4 rounded-2xl bg-[#f5f5f7] px-6 py-5"
            >
              {isCompleted ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0058cc]">
                  <Check className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                  {reqCount > 0 ? (
                    <FileText className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              )}
              <div className="flex-1">
                <p
                  className={`text-[17px] font-medium ${isCompleted ? "text-gray-400" : "text-gray-900"}`}
                >
                  {step.label}
                </p>
                {reqCount > 0 && (
                  <p className="mt-0.5 text-[14px] text-gray-400">
                    {completedReqs} of {reqCount} items done
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel application */}
      {!progress.submitted && (
        <div className="mt-8 text-center">
          <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <AlertDialogTrigger className="text-[14px] text-gray-400 transition-colors hover:text-red-500">
              Cancel my application
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel your application?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all your progress. Any documents you uploaded
                  will still be saved, but you will need to start the
                  application again from the beginning.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my application</AlertDialogCancel>
                <Button
                  onClick={() => {
                    cancelApplication();
                    setCancelOpen(false);
                  }}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Yes, cancel it
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
