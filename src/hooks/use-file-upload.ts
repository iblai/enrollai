"use client";

import { useState, useCallback, useMemo } from "react";
import {
  createFileReference,
  validateFile,
  type FileReference,
} from "@iblai/iblai-js/web-utils";
import { useGetFileUploadUrlMutation } from "@iblai/iblai-js/data-layer";
import { resolveAppTenant } from "@/lib/iblai/tenant";

interface UseFileUploadOptions {
  sessionId: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  onComplete?: (ref: FileReference) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [getUploadUrl] = useGetFileUploadUrlMutation();

  const org = useMemo(() => resolveAppTenant(), []);
  const userId = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw).user_nicename ?? "" : "";
    } catch {
      return "";
    }
  }, []);

  const upload = useCallback(
    async (file: File): Promise<FileReference | null> => {
      const validationError = validateFile(
        file,
        options.maxSizeBytes,
        options.allowedTypes
      );
      if (validationError) {
        options.onError?.(validationError);
        return null;
      }

      setIsUploading(true);
      setProgress(0);

      try {
        const ref = await createFileReference(
          file,
          options.sessionId,
          (params) =>
            getUploadUrl(params).unwrap(),
          org,
          userId,
          (p) => setProgress(p)
        );
        options.onComplete?.(ref);
        return ref;
      } catch (err) {
        options.onError?.(
          err instanceof Error ? err.message : "Upload failed"
        );
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options, getUploadUrl, org, userId]
  );

  return { upload, isUploading, progress };
}

export type { FileReference };
