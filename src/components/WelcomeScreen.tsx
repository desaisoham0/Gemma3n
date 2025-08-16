import { ChatInput } from "./ChatInput";
import type { AiMode } from "../config/aiModes";

interface WelcomeScreenProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  selectedMode: AiMode;
  onModeChange: (mode: AiMode) => void;
}

export function WelcomeScreen({
  input,
  onChange,
  onSubmit,
  disabled,
  selectedMode,
  onModeChange,
}: WelcomeScreenProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-sm">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-gray-100">
            Welcome to Chat
          </h1>
          <p className="text-sm text-gray-400">
            Choose an AI mode and start a conversation below
          </p>
        </div>
        <div className="w-full">
          <ChatInput
            value={input}
            onChange={onChange}
            onSubmit={onSubmit}
            disabled={disabled}
            selectedMode={selectedMode}
            onModeChange={onModeChange}
          />
        </div>
      </div>
    </section>
  );
}
