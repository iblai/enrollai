"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import {
  MediaBox,
  type UploadedFile,
} from "@iblai/iblai-js/web-containers/next";
import {
  useGetUserResumeQuery,
  useCreateUserResumeMutation,
} from "@/services/career-api";
import { resolveAppTenant } from "@/lib/iblai/tenant";

function getUserName(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem("userData");
    return raw ? JSON.parse(raw).user_nicename ?? "" : "";
  } catch {
    return "";
  }
}

export function DocumentUploads() {
  const org = useMemo(() => resolveAppTenant(), []);
  const username = useMemo(() => getUserName(), []);

  const { data, isLoading, isError, refetch } = useGetUserResumeQuery(
    { org, username },
    { skip: !org || !username }
  );

  const [createResume, { isLoading: isUploading }] =
    useCreateUserResumeMutation();

  const uploadedMedia: UploadedFile[] = useMemo(() => {
    if (!data) return [];
    const files = (data.files ?? []).map((f) => ({
      name: f.name,
      url: f.url,
      type: f.type,
    }));
    const links = (data.links ?? []).map((l) => ({
      name: l.url,
      url: l.url,
      type: "link",
    }));
    return [...files, ...links];
  }, [data]);

  async function handleUploadFile(file: File, isResume: boolean) {
    const formData = new FormData();
    formData.append("user", username);
    formData.append("platform", org);

    if (isResume) {
      formData.append("resume", file);
    } else {
      formData.append("additional_files", file);
    }

    try {
      await createResume({
        org,
        username,
        resume: formData,
        method: "POST",
      }).unwrap();
      toast.success("File uploaded successfully");
      refetch();
    } catch {
      toast.error("Failed to upload file");
    }
  }

  async function handleUploadLink(url: string) {
    const formData = new FormData();
    formData.append("user", username);
    formData.append("platform", org);

    // Preserve existing links
    const existingLinks = data?.links ?? [];
    existingLinks.forEach((link, index) => {
      formData.append(`link_${existingLinks.length + 1 - index}`, link.url);
    });
    formData.append("link_1", url);

    try {
      await createResume({
        org,
        username,
        resume: formData,
      }).unwrap();
      toast.success("Link added successfully");
      refetch();
    } catch {
      toast.error("Failed to add link");
    }
  }

  if (!org || !username) {
    return (
      <div className="px-5 py-4">
        <p className="text-[14px] text-[#86868b]">
          Please sign in to upload your documents.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5">
      <h3 className="mb-3 text-[13px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">
        Documents
      </h3>
      <MediaBox
        uploadedMedia={uploadedMedia}
        isLoading={isLoading}
        isError={isError}
        isUploading={isUploading}
        resumeCheckboxEnabled={true}
        onUploadFile={handleUploadFile}
        onUploadLink={handleUploadLink}
        onError={(msg) => toast.error(msg)}
      />
    </div>
  );
}
