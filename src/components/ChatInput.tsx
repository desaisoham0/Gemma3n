import React, { useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { AiModeSelector } from "./AiModeSelector";
import type { AiMode } from "../config/aiModes";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  selectedMode: AiMode;
  onModeChange: (mode: AiMode) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled,
  selectedMode,
  onModeChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 192;
    const minHeight = 44;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    setTimeout(adjustTextareaHeight, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 md:py-8">
      <div className="mb-3 flex items-center justify-start">
        <AiModeSelector
          selectedMode={selectedMode}
          onModeChange={onModeChange}
          disabled={disabled}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-3 rounded-2xl border border-gray-700 bg-[#131f24] p-3 shadow-sm"
        aria-label="Chat input form"
      >
        <label htmlFor="message" className="sr-only">
          Type your message
        </label>

        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            id="message"
            className="w-full resize-none bg-transparent px-3 py-2 font-sans text-base font-normal leading-relaxed text-gray-200 placeholder-gray-400 focus:outline-none"
            placeholder={`Ask your ${selectedMode.name.toLowerCase()}...`}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoFocus
            rows={1}
            aria-describedby="message-help"
          />
          <p id="message-help" className="mt-1 text-xs text-gray-400">
            Press Enter to send, Shift + Enter for a new line
          </p>
        </div>

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="cursor-pointer flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 active:bg-blue-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
          title={disabled ? "Please wait..." : "Send message (Enter)"}
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </section>
  );
};
