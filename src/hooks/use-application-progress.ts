"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGetMentorMetadataQuery,
  useSetMentorMetadataMutation,
} from "@/services/mentor-metadata-api";
import { resolveAppTenant } from "@/lib/iblai/tenant";
import type { AdmissionsConfig } from "@/config/admissions-config";

const LOCAL_KEY = "enrollai_application_progress";
const META_KEY = "application_progress";

interface StepStatus {
  stepId: string;
  completed: boolean;
  requirementsCompleted: string[];
}

export interface ApplicationProgress {
  currentStepId: string;
  steps: StepStatus[];
  startedAt: string;
  lastUpdated: string;
  submitted: boolean;
}

function getUserName(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem("userData");
    return raw ? JSON.parse(raw).user_nicename ?? "" : "";
  } catch {
    return "";
  }
}

function readLocal(): ApplicationProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocal(data: ApplicationProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

function buildInitial(config: AdmissionsConfig): ApplicationProgress {
  return {
    currentStepId: config.steps[0]?.id ?? "",
    steps: config.steps.map((s) => ({
      stepId: s.id,
      completed: false,
      requirementsCompleted: [],
    })),
    startedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    submitted: false,
  };
}

/** Pick the more-advanced progress (more requirements completed). */
function mergeProgress(
  local: ApplicationProgress | null,
  remote: ApplicationProgress | null,
  config: AdmissionsConfig
): ApplicationProgress {
  if (!local && !remote) return buildInitial(config);
  if (!local) return remote!;
  if (!remote) return local;

  // Use whichever has more completed requirements overall
  const countReqs = (p: ApplicationProgress) =>
    p.steps.reduce((n, s) => n + s.requirementsCompleted.length, 0);

  return countReqs(remote) >= countReqs(local) ? remote : local;
}

export function useApplicationProgress(config: AdmissionsConfig) {
  const [progress, setProgress] = useState<ApplicationProgress | null>(() => {
    return readLocal();
  });

  const org = typeof window !== "undefined" ? resolveAppTenant() : "";
  const username = typeof window !== "undefined" ? getUserName() : "";
  const mentorId = config.mentorId;
  const canSync = !!(org && username && mentorId);

  // Fetch remote progress
  const { data: remoteData } = useGetMentorMetadataQuery(
    { org, username, mentorId },
    { skip: !canSync }
  );

  const [saveMeta] = useSetMentorMetadataMutation();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Merge remote data on first load
  const hasMergedRef = useRef(false);
  useEffect(() => {
    if (hasMergedRef.current || !remoteData) return;

    const remoteProgress = remoteData?.metadata?.[META_KEY] as
      | ApplicationProgress
      | undefined;

    if (!remoteProgress) {
      hasMergedRef.current = true;
      return;
    }

    const local = readLocal();
    const merged = mergeProgress(local, remoteProgress, config);

    hasMergedRef.current = true;
    setProgress(merged);
    writeLocal(merged);

    // If local was ahead, push to server
    if (merged !== remoteProgress) {
      saveMeta({ org, mentorId, metadata: { [META_KEY]: merged } });
    }
  }, [remoteData, config, org, mentorId, saveMeta]);

  /** Debounced save to server */
  const persistToServer = useCallback(
    (data: ApplicationProgress) => {
      writeLocal(data);
      if (!canSync) return;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveMeta({ org, mentorId, metadata: { [META_KEY]: data } });
      }, 1000);
    },
    [canSync, org, mentorId, saveMeta]
  );

  const markRequirementComplete = useCallback(
    (stepId: string, requirementId: string) => {
      setProgress((prev) => {
        if (!prev) return prev;
        const updated: ApplicationProgress = {
          ...prev,
          lastUpdated: new Date().toISOString(),
          steps: prev.steps.map((s) => {
            if (s.stepId !== stepId) return s;
            const reqs = s.requirementsCompleted.includes(requirementId)
              ? s.requirementsCompleted
              : [...s.requirementsCompleted, requirementId];
            const configStep = config.steps.find((cs) => cs.id === stepId);
            const completed = configStep
              ? configStep.requirements.every((r) => reqs.includes(r))
              : false;
            return { ...s, requirementsCompleted: reqs, completed };
          }),
        };
        // Advance current step if completed
        const currentIdx = updated.steps.findIndex(
          (s) => s.stepId === updated.currentStepId
        );
        if (currentIdx >= 0 && updated.steps[currentIdx].completed) {
          const nextIncomplete = updated.steps.find(
            (s, i) => i > currentIdx && !s.completed
          );
          if (nextIncomplete) {
            updated.currentStepId = nextIncomplete.stepId;
          }
        }
        persistToServer(updated);
        return updated;
      });
    },
    [config, persistToServer]
  );

  const markSubmitted = useCallback(() => {
    setProgress((prev) => {
      if (!prev) return prev;
      const updated: ApplicationProgress = {
        ...prev,
        submitted: true,
        lastUpdated: new Date().toISOString(),
      };
      persistToServer(updated);
      return updated;
    });
  }, [persistToServer]);

  const startApplication = useCallback(() => {
    if (progress) return; // already started
    const initial = buildInitial(config);
    setProgress(initial);
    persistToServer(initial);
  }, [progress, config, persistToServer]);

  const cancelApplication = useCallback(() => {
    localStorage.removeItem(LOCAL_KEY);
    setProgress(null);
    if (canSync) {
      saveMeta({ org, mentorId, metadata: { [META_KEY]: null } });
    }
  }, [canSync, org, mentorId, saveMeta]);

  const completedSteps = progress
    ? progress.steps.filter((s) => s.completed).length
    : 0;
  const totalSteps = progress ? progress.steps.length : 1;
  const completionPercentage = Math.round(
    (completedSteps / totalSteps) * 100
  );

  return {
    progress,
    startApplication,
    markRequirementComplete,
    markSubmitted,
    cancelApplication,
    completionPercentage,
    completedSteps,
    totalSteps,
  };
}
