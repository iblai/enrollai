"use client";

import { useState } from "react";
import { HelpCircle, Mail, Phone, MessageCircle, X } from "lucide-react";

const helpOptions = [
  {
    icon: Phone,
    label: "Call us",
    description: "Speak to someone now",
    href: "tel:+441234567890",
  },
  {
    icon: Mail,
    label: "Email us",
    description: "admissions@enrollai.ac.uk",
    href: "mailto:admissions@enrollai.ac.uk",
  },
  {
    icon: MessageCircle,
    label: "Live chat",
    description: "Chat with our team",
    href: "#live-chat",
  },
];

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-5 bottom-5 z-[60]">
      {open && (
        <div className="mb-3 w-72 rounded-2xl bg-white p-5 shadow-xl shadow-black/10">
          <h3 className="mb-1 text-[17px] font-semibold text-gray-900">
            Need help?
          </h3>
          <p className="mb-4 text-[14px] leading-[1.43] text-gray-500">
            Our admissions team is here to help you with your application.
          </p>
          <div className="flex flex-col gap-2">
            {helpOptions.map(({ icon: Icon, label, description, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-xl bg-[#f5f5f7] px-4 py-3 transition-colors hover:bg-[#ececee]"
              >
                <Icon className="h-5 w-5 shrink-0 text-[#0058cc]" />
                <div>
                  <p className="text-[15px] font-medium text-gray-900">
                    {label}
                  </p>
                  <p className="text-[13px] text-gray-500">{description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0058cc] text-white shadow-lg shadow-[#0058cc]/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#0058cc]/30 active:scale-95"
        aria-label={open ? "Close help" : "Need help?"}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <HelpCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
