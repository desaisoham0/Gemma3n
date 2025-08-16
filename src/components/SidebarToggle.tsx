import { Bars3Icon, PencilSquareIcon } from "@heroicons/react/24/solid";

interface SidebarToggleProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  loading: boolean;
}

export function SidebarToggle({
  onToggleSidebar,
  onNewChat,
  loading,
}: SidebarToggleProps) {
  return (
    <div className="fixed left-4 top-4 z-50 flex flex-col gap-2">
      <button
        className="cursor-pointer rounded-2xl bg-gray-800 p-2 text-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>
      <button
        className="cursor-pointer rounded-2xl bg-gray-800 p-2 text-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50"
        onClick={onNewChat}
        disabled={loading}
        aria-label="Start new chat"
      >
        <PencilSquareIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
