import { ChatWindow } from "./ChatWindow";
import { ChatInput } from "./ChatInput";
import type { Message } from "../types";
import type { AiMode } from "../config/aiModes";

interface ChatLayoutProps {
  messages: Message[];
  loading: boolean;
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedMode: AiMode;
  onModeChange: (mode: AiMode) => void;
}

export function ChatLayout({
  messages,
  loading,
  input,
  onChange,
  onSubmit,
  selectedMode,
  onModeChange,
}: ChatLayoutProps) {
  return (
    <>
      <main className="flex-1 w-full overflow-y-auto px-4 pt-8 pb-64 sm:px-8 md:px-12 lg:px-20 xl:px-32">
        <div className="mx-auto w-full max-w-6xl">
          <ChatWindow
            messages={messages.filter((msg) => msg.role !== "system")}
            loading={loading}
          />
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#0b1418] via-[#0b1418]/80 to-transparent backdrop-blur-sm">
        <ChatInput
          value={input}
          onChange={onChange}
          onSubmit={onSubmit}
          disabled={loading}
          selectedMode={selectedMode}
          onModeChange={onModeChange}
        />
      </div>
    </>
  );
}
