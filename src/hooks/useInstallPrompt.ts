// src/hooks/useInstallPrompt.ts
import { useEffect, useState } from "react";

// Define a type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Type guard to check if the event matches our expected structure
      if (
        "prompt" in e &&
        typeof (e as BeforeInstallPromptEvent).prompt === "function"
      ) {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the PWA install");
      } else {
        console.log("User dismissed the PWA install");
      }
      setDeferredPrompt(null);
    }
  };

  return { deferredPrompt, promptInstall };
};
