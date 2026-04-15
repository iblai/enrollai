"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Paperclip, ArrowUp, Square, FileText, MessageCircle, HelpCircle, PenLine } from "lucide-react";

const starters = [
  { label: "Start my application", icon: MessageCircle },
  { label: "What documents do I need?", icon: FileText },
  { label: "Help with personal statement", icon: PenLine },
  { label: "Question about qualifications", icon: HelpCircle },
];

interface ChatInputProps {
  onSend: (message: string) => void;
  onFileSelect: (files: FileList) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  onStopGenerating?: () => void;
  showStarters?: boolean;
}

export function ChatInput({
  onSend,
  onFileSelect,
  disabled,
  isStreaming,
  onStopGenerating,
  showStarters,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Input bar */}
      <div className="group flex items-end gap-1.5 rounded-[16px] bg-[#f5f5f7] px-3 py-2 transition-colors focus-within:bg-[#ededf0]">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[#86868b] transition-colors hover:bg-white/60 hover:text-[#1d1d1f] disabled:opacity-40"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip className="h-[17px] w-[17px]" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx"
          capture="environment"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFileSelect(e.target.files);
              e.target.value = "";
            }
          }}
        />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTextareaInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          rows={1}
          disabled={disabled}
          className="min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-[1.5] tracking-[-0.01em] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none disabled:opacity-50"
        />

        {isStreaming ? (
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-white transition-transform hover:scale-105 active:scale-95"
            onClick={onStopGenerating}
          >
            <Square className="h-3 w-3" fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-white transition-all hover:scale-105 active:scale-95 disabled:bg-[#c7c7cc] disabled:hover:scale-100"
            onClick={handleSend}
            disabled={!text.trim() || disabled}
          >
            <ArrowUp className="h-[17px] w-[17px]" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Starters */}
      {showStarters && (
        <div className="grid grid-cols-2 gap-2.5">
          {starters.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onSend(s.label)}
              disabled={disabled}
              className="group/card flex items-start gap-3 rounded-[14px] bg-[#f5f5f7] px-4 py-3.5 text-left transition-all hover:bg-[#ededf0] active:scale-[0.98] disabled:opacity-50"
            >
              <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#86868b] transition-colors group-hover/card:text-[#0058cc]" />
              <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.01em] text-[#1d1d1f]">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
