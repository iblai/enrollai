"use client";

import { Check, Circle } from "lucide-react";
import type { AdmissionsConfig } from "@/config/admissions-config";
import type { ApplicationProgress } from "@/hooks/use-application-progress";

interface ProgressTrackerProps {
  config: AdmissionsConfig;
  progress: ApplicationProgress | null;
  completionPercentage: number;
}

export function ProgressTracker({
  config,
  progress,
  completionPercentage,
}: ProgressTrackerProps) {
  if (!progress) return null;

  return (
    <div className="flex flex-col gap-5 px-5 pt-6 pb-5">
      {/* Percentage ring */}
      <div className="flex flex-col items-center gap-2 pb-2">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#f5f5f7"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(completionPercentage / 100) * 175.93} 175.93`}
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00b0ef" />
                <stop offset="100%" stopColor="#0058cc" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-[16px] font-semibold tabular-nums tracking-[-0.02em] text-[#1d1d1f]">
            {completionPercentage}%
          </span>
        </div>
        <span className="text-[12px] font-medium text-[#86868b]">
          Complete
        </span>
      </div>

      {/* Steps */}
      <div className="flex flex-col">
        {config.steps.map((step, idx) => {
          const stepStatus = progress.steps.find((s) => s.stepId === step.id);
          const isCompleted = stepStatus?.completed ?? false;
          const isCurrent = progress.currentStepId === step.id;
          const isLast = idx === config.steps.length - 1;

          return (
            <div key={step.id} className="flex gap-3">
              {/* Vertical line + indicator */}
              <div className="flex flex-col items-center">
                <StepDot completed={isCompleted} current={isCurrent} />
                {!isLast && (
                  <div
                    className={`w-px flex-1 ${
                      isCompleted ? "bg-[#0058cc]/20" : "bg-[#f5f5f7]"
                    }`}
                  />
                )}
              </div>
              {/* Label */}
              <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
                <span
                  className={`text-[13px] tracking-[-0.01em] ${
                    isCompleted
                      ? "font-medium text-[#86868b]"
                      : isCurrent
                        ? "font-semibold text-[#1d1d1f]"
                        : "font-medium text-[#aeaeb2]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepDot({
  completed,
  current,
}: {
  completed: boolean;
  current: boolean;
}) {
  if (completed) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0058cc]">
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </div>
    );
  }
  if (current) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <div className="h-3 w-3 rounded-full bg-[#0058cc]" />
      </div>
    );
  }
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
      <Circle className="h-3 w-3 text-[#d1d1d6]" strokeWidth={2} />
    </div>
  );
}

export function ProgressBar({
  completionPercentage,
}: {
  completionPercentage: number;
}) {
  return (
    <div className="flex items-center gap-3 px-4">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f5f5f7]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00b0ef] to-[#0058cc] transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <span className="text-[12px] font-medium tabular-nums text-[#86868b]">
        {completionPercentage}%
      </span>
    </div>
  );
}
