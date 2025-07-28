import React, { useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea function
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 180;
    const minHeight = 56;
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
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 md:py-8">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-3 bg-[#131f24] border border-gray-700 rounded-2xl p-3 shadow-lg"
      >
        {/* Accessible label hidden visually */}
        <label htmlFor="message" className="sr-only">
          Type your message
        </label>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            id="message"
            className="w-full bg-transparent placeholder-gray-400 text-gray-200 text-base font-normal px-3 py-2 focus:outline-none resize-none leading-relaxed font-sans"
            placeholder="Ask me anything..."
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoFocus
            rows={1}
            style={{
              minHeight: "44px",
              maxHeight: "180px",
              overflowY: value.length > 150 ? "auto" : "hidden",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
          title={disabled ? "Please wait..." : "Send message (Enter)"}
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white" />
        </button>
      </form>
    </div>
  );
};
