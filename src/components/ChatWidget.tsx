"use client";

import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function ChatWidget() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL;
    if (!url) return;

    createChat({
      webhookUrl: url,

      // ✅ customize the widget here (valid keys)
      initialMessages: [
        "Hey there! 👋 I’m Dixie, the OffWeb assistant. How can I help you today?"
      ],
      title: "OffWeb Chat",
      subtitle: "Websites, automations & quotes",
      theme: {
        primaryColor: "#06b6d4",
        backgroundColor: "#000000",
      },
      // avatarUrl: "/icon.jpeg", // if you want a custom avatar (supported in recent versions)
    } as any); // (optional) cast if your installed version's types are narrower
  }, []);

  return null;
}
