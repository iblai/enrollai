"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { stripMarkers } from "@/lib/admissions/progress-parser";
import { FileText, Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  profileImage?: string;
  mentorName?: string;
  fileAttachments?: { fileName: string; fileType: string }[];
}

export function ChatMessage({
  role,
  content,
  profileImage,
  mentorName,
  fileAttachments,
}: ChatMessageProps) {
  const cleanContent = stripMarkers(content);
  if (!cleanContent && (!fileAttachments || fileAttachments.length === 0))
    return null;

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%]">
          <div className="rounded-[18px] rounded-br-[6px] bg-[#0058cc] px-4 py-2.5">
            <p className="whitespace-pre-wrap text-[15px] leading-[1.5] tracking-[-0.01em] text-white">
              {cleanContent}
            </p>
          </div>
          {fileAttachments && fileAttachments.length > 0 && (
            <div className="mt-1.5 flex flex-wrap justify-end gap-1.5">
              {fileAttachments.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-[10px] bg-[#0058cc]/[0.08] px-2.5 py-1 text-[12px] font-medium text-[#0058cc]"
                >
                  <FileText className="h-3 w-3" />
                  {f.fileName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Avatar className="mt-0.5 h-7 w-7 shrink-0">
        {profileImage && <AvatarImage src={profileImage} alt="AI" />}
        <AvatarFallback className="bg-gradient-to-br from-[#00b0ef] to-[#0058cc]">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 max-w-[85%]">
        {mentorName && (
          <p className="mb-1 text-[12px] font-medium text-[#86868b]">
            {mentorName}
          </p>
        )}
        <div className="whitespace-pre-wrap text-[15px] leading-[1.6] tracking-[-0.01em] text-[#1d1d1f]">
          {cleanContent}
        </div>
      </div>
    </div>
  );
}

export function StreamingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="mt-0.5 h-7 w-7 shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-[#00b0ef] to-[#0058cc]">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 pt-2">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#86868b] [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#86868b] [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#86868b] [animation-delay:300ms]" />
      </div>
    </div>
  );
}
