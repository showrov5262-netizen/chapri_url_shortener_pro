import type { ReactNode } from "react";
import { AiStateProvider } from "@/hooks/use-ai-state";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <AiStateProvider>
      <div className="space-y-8">
        {children}
      </div>
    </AiStateProvider>
  );
}
