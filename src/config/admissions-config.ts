export interface AdmissionsRequirement {
  id: string;
  label: string;
  description: string;
  type: "document" | "text" | "conversation";
  required: boolean;
  acceptedFormats?: string[];
  maxSizeBytes?: number;
}

export interface AdmissionsStep {
  id: string;
  label: string;
  requirements: string[];
  order: number;
}

export interface AdmissionsConfig {
  mentorId: string;
  steps: AdmissionsStep[];
  requirements: AdmissionsRequirement[];
  welcomeTitle: string;
  welcomeDescription: string;
}

export const defaultAdmissionsConfig: AdmissionsConfig = {
  mentorId: process.env.NEXT_PUBLIC_DEFAULT_AGENT_ID ?? "",
  welcomeTitle: "Let's get you enrolled",
  welcomeDescription:
    "Our AI assistant will guide you through your application step by step. Your progress is saved, so you can come back anytime.",
  steps: [
    {
      id: "personal-info",
      label: "Personal Details",
      requirements: ["full-name", "date-of-birth", "contact-info"],
      order: 1,
    },
    {
      id: "identity",
      label: "Photo ID",
      requirements: ["proof-of-identity"],
      order: 2,
    },
    {
      id: "qualifications",
      label: "Qualifications",
      requirements: ["qualification-docs"],
      order: 3,
    },
    {
      id: "personal-statement",
      label: "Personal Statement",
      requirements: ["personal-statement"],
      order: 4,
    },
    {
      id: "cv",
      label: "CV / Work Experience",
      requirements: ["cv-upload"],
      order: 5,
    },
    {
      id: "review",
      label: "Review & Send",
      requirements: [],
      order: 6,
    },
  ],
  requirements: [
    {
      id: "full-name",
      label: "Full Name",
      description: "Your full legal name as it appears on your ID",
      type: "conversation",
      required: true,
    },
    {
      id: "date-of-birth",
      label: "Date of Birth",
      description: "Your date of birth",
      type: "conversation",
      required: true,
    },
    {
      id: "contact-info",
      label: "Contact Information",
      description: "Your email address and phone number",
      type: "conversation",
      required: true,
    },
    {
      id: "proof-of-identity",
      label: "Proof of Identity",
      description:
        "A photo or scan of your passport, driving licence, or national ID card",
      type: "document",
      required: true,
      acceptedFormats: ["application/pdf", "image/jpeg", "image/png"],
      maxSizeBytes: 10 * 1024 * 1024,
    },
    {
      id: "qualification-docs",
      label: "Qualification Certificates",
      description:
        "Photos or scans of your certificates (e.g. GCSEs, A-Levels, BTECs, or any other qualifications)",
      type: "document",
      required: true,
      acceptedFormats: ["application/pdf", "image/jpeg", "image/png"],
      maxSizeBytes: 10 * 1024 * 1024,
    },
    {
      id: "personal-statement",
      label: "Personal Statement",
      description:
        "Tell us in your own words why you want to study with us and what you hope to get out of it",
      type: "conversation",
      required: true,
    },
    {
      id: "cv-upload",
      label: "CV / Resume",
      description:
        "Upload your CV if you have one, or the assistant will help you describe your work experience",
      type: "document",
      required: false,
      acceptedFormats: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      maxSizeBytes: 5 * 1024 * 1024,
    },
  ],
};
