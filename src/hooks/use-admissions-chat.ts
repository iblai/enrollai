"use client";

import { useMemo, useCallback, useEffect } from "react";
import { useAdvancedChat, type FileReference } from "@iblai/iblai-js/web-utils";
import config from "@/lib/iblai/config";
import { resolveAppTenant } from "@/lib/iblai/tenant";
import { redirectToAuthSpa } from "@/lib/iblai/auth-utils";
import {
  parseProgressMarkers,
  parseUploadRequests,
} from "@/lib/admissions/progress-parser";
import type { AdmissionsConfig } from "@/config/admissions-config";

export function useAdmissionsChat(
  admissionsConfig: AdmissionsConfig,
  onProgressUpdate?: (step: string, requirement: string) => void
) {
  const tenantKey = useMemo(() => resolveAppTenant(), []);
  const username = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw).user_nicename ?? "" : "";
    } catch {
      return "";
    }
  }, []);
  const token = useMemo(
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem("axd_token") ?? ""
        : "",
    []
  );

  const chat = useAdvancedChat({
    tenantKey,
    mentorId: admissionsConfig.mentorId,
    username,
    token,
    wsUrl: config.wsUrl(),
    stopGenerationWsUrl: config.wsUrl(),
    redirectToAuthSpa,
  });

  const sendWithFiles = useCallback(
    async (text: string, fileRefs?: FileReference[]) => {
      await chat.sendMessage("chat", text, {
        fileReferences: fileRefs,
      });
    },
    [chat.sendMessage]
  );

  // Parse progress markers from the latest assistant message
  const assistantMessages = chat.messages.filter((m) => m.role === "assistant");
  const latestAssistant = assistantMessages.at(-1);

  const latestProgressMarkers = useMemo(
    () =>
      latestAssistant ? parseProgressMarkers(latestAssistant.content) : [],
    [latestAssistant?.content]
  );

  const latestUploadRequests = useMemo(
    () =>
      latestAssistant ? parseUploadRequests(latestAssistant.content) : [],
    [latestAssistant?.content]
  );

  // Notify parent when progress markers are detected
  useEffect(() => {
    if (onProgressUpdate) {
      for (const marker of latestProgressMarkers) {
        if (marker.status === "complete") {
          onProgressUpdate(marker.step, marker.requirement);
        }
      }
    }
  }, [latestProgressMarkers, onProgressUpdate]);

  return {
    messages: chat.messages,
    isStreaming: chat.isStreaming,
    isPending: chat.isPending,
    status: chat.status,
    sessionId: chat.sessionId,
    isConnected: chat.isConnected,
    isLoadingSessionIds: chat.isLoadingSessionIds,
    currentStreamingMessage: chat.currentStreamingMessage,
    mentorName: chat.mentorName,
    profileImage: chat.profileImage,
    sendMessage: chat.sendMessage,
    sendWithFiles,
    startNewChat: chat.startNewChat,
    stopGenerating: chat.stopGenerating,
    latestProgressMarkers,
    latestUploadRequests,
  };
}
