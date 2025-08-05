import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { AI_MODES, type AiMode } from "../config/aiModes.ts";

interface AiModeSelectorProps {
  selectedMode: AiMode;
  onModeChange: (mode: AiMode) => void;
  disabled?: boolean;
}

export const AiModeSelector: React.FC<AiModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleModeSelect = (mode: AiMode) => {
    onModeChange(mode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg
          text-sm text-gray-200 hover:bg-gray-700 transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? "ring-2 ring-blue-500/50" : ""}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-base">{selectedMode.icon}</span>
        <span className="font-medium">{selectedMode.name}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
          <div className="py-2">
            {AI_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeSelect(mode)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150
                  flex items-start gap-3 group
                `}
              >
                <span className="text-lg mt-0.5">{mode.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-200 text-sm">
                      {mode.name}
                    </span>
                    {selectedMode.id === mode.id && (
                      <CheckIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {mode.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
