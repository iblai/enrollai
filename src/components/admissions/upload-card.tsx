"use client";

import { useRef, useState } from "react";
import { Upload, Check, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFileUpload, type FileReference } from "@/hooks/use-file-upload";

interface UploadCardProps {
  requirementId: string;
  label: string;
  description: string;
  acceptedFormats?: string[];
  sessionId: string;
  onUploaded: (ref: FileReference) => void;
}

export function UploadCard({
  label,
  description,
  acceptedFormats,
  sessionId,
  onUploaded,
}: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { upload, isUploading, progress } = useFileUpload({
    sessionId,
    allowedTypes: acceptedFormats,
    maxSizeBytes: 10 * 1024 * 1024,
    onComplete: (ref) => {
      setUploadedFile(ref.file_name);
      setError(null);
      onUploaded(ref);
    },
    onError: (msg) => setError(msg),
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    await upload(file);
  }

  const accept = acceptedFormats?.join(",") ?? "image/*,application/pdf";

  if (uploadedFile) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4">
        <Check className="h-5 w-5 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-emerald-800">{label}</p>
          <p className="truncate text-[14px] text-emerald-600">
            {uploadedFile}
          </p>
        </div>
        <FileText className="h-5 w-5 shrink-0 text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#f5f5f7] p-5">
      <div className="mb-3 flex items-start gap-3">
        <Upload className="mt-0.5 h-5 w-5 shrink-0 text-[#0058cc]" />
        <div>
          <p className="text-[15px] font-medium text-gray-900">{label}</p>
          <p className="mt-0.5 text-[14px] leading-[1.43] text-gray-500">
            {description}
          </p>
        </div>
      </div>

      {isUploading ? (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-[14px] text-gray-400">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      ) : (
        <>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="h-14 w-full rounded-xl bg-white text-[17px] font-medium text-[#0058cc] shadow-none hover:bg-gray-50"
          >
            <Upload className="mr-2 h-5 w-5" />
            Choose a file or take a photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            capture="environment"
            onChange={handleFileChange}
          />
        </>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-[14px] text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
