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
    <Listbox value={selectedMode} onChange={onModeChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          className={`
            flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg
            text-sm text-gray-200 hover:bg-gray-700 transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span className="text-base">{selectedMode.icon}</span>
          <span className="font-medium">{selectedMode.name}</span>
          <ChevronDownIcon className="w-4 h-4 ml-2" />
        </Listbox.Button>

        <Listbox.Options className="absolute bottom-full left-0 mb-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 py-2">
          {AI_MODES.map((mode) => (
            <Listbox.Option
              key={mode.id}
              value={mode}
              className={({ active }) =>
                `w-full px-4 py-3 text-left flex items-start gap-3 group cursor-pointer ${
                  active ? "bg-gray-700" : ""
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className="text-lg mt-0.5">{mode.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-200 text-sm">
                        {mode.name}
                      </span>
                      {selected && (
                        <CheckIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
