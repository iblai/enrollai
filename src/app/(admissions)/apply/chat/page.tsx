"use client";

import { defaultAdmissionsConfig } from "@/config/admissions-config";
import { ChatInterface } from "@/components/admissions/chat-interface";

export default function ChatPage() {
  return <ChatInterface config={defaultAdmissionsConfig} />;
}
