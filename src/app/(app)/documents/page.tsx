"use client";

import { Camera, FileText, Briefcase } from "lucide-react";
import { DocumentUploads } from "@/components/admissions/document-uploads";

const requiredDocs = [
  {
    icon: Camera,
    label: "Photo ID",
    detail: "Passport, driving licence, or national ID card",
  },
  {
    icon: FileText,
    label: "Qualification certificates",
    detail: "GCSEs, A-Levels, BTECs, or equivalent",
  },
  {
    icon: Briefcase,
    label: "CV (optional)",
    detail: "If you have one — PDF or Word document",
  },
];

export default function DocumentsPage() {
  return (
    <div className="mx-auto w-full flex-1 px-4 py-8 md:w-[75vw] md:px-0">
      <div className="w-full">
        <h1 className="mb-1 text-[28px] font-semibold tracking-[-0.02em] text-gray-900">
          Your Documents
        </h1>
        <p className="mb-6 text-[15px] leading-[1.47] text-gray-500">
          Upload your documents here. Everything you upload is saved and can
          be viewed by our admissions team.
        </p>

        {/* What to upload */}
        <div className="mb-6 rounded-2xl bg-[#f5f5f7] p-5">
          <h2 className="mb-3 text-[15px] font-semibold text-gray-900">
            What we need from you
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {requiredDocs.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-start gap-3 sm:flex-1">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#0058cc]" />
                <div>
                  <p className="text-[15px] font-medium text-gray-900">
                    {label}
                  </p>
                  <p className="text-[13px] text-gray-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm shadow-black/[0.03]">
          <DocumentUploads />
        </div>
      </div>
    </div>
  );
}
