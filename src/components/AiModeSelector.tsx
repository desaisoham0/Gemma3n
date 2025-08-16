import { Listbox } from "@headlessui/react";
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
  return (
    <Listbox
      value={selectedMode}
      onChange={onModeChange}
      disabled={disabled}
      as="div"
      className="relative inline-block"
    >
      <Listbox.Button
        className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-gray-200 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 hover:bg-gray-700 active:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Select AI mode"
      >
        <span className="text-base">{selectedMode.icon}</span>
        <span className="font-medium truncate max-w-[10rem] sm:max-w-[12rem]">
          {selectedMode.name}
        </span>
        <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0" />
      </Listbox.Button>

      <Listbox.Options className="absolute bottom-full left-0 z-50 mb-2 w-72 sm:w-80 md:w-96 max-w-screen bg-gray-800 border border-gray-600 rounded-2xl shadow-xl p-2 max-h-80 overflow-auto focus:outline-none">
        {AI_MODES.map((mode) => (
          <Listbox.Option
            key={mode.id}
            value={mode}
            className={({ active }) =>
              `w-full rounded-xl px-3 py-2.5 text-left flex items-start gap-3 outline-none cursor-pointer transition ${active ? "bg-gray-700" : ""} focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900`
            }
          >
            {({ selected }) => (
              <div className="flex w-full items-start gap-3">
                <span className="text-lg mt-0.5">{mode.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-gray-200">
                      {mode.name}
                    </span>
                    {selected && (
                      <CheckIcon className="h-4 w-4 shrink-0 text-blue-400" />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400 break-words">
                    {mode.description}
                  </p>
                </div>
              </div>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};
