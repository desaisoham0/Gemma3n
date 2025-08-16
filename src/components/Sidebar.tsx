import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";
import type { Chat } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  loading: boolean;
}

export function Sidebar({
  isOpen,
  onClose,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  loading,
}: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full w-64 transform border-r border-gray-700 bg-[#131f24] text-gray-200 shadow-xl transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Sidebar"
    >
      <header className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">Chat Menu</h2>
          <p className="text-sm text-gray-400">Manage conversations</p>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-2xl p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="flex h-[calc(100vh-56px)] flex-col gap-3 p-4">
        <button
          className="cursor-pointer w-full rounded-2xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 active:bg-blue-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50"
          onClick={onNewChat}
          disabled={loading}
        >
          Start New Chat
        </button>

        <div className="mt-2 flex-1 space-y-2 overflow-y-auto">
          <h3 className="px-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Chat History
          </h3>
          {chats.length === 0 ? (
            <p className="px-2 py-2 text-sm text-gray-500">No chats yet</p>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} className="group relative flex items-center">
                <button
                  className={`cursor-pointer flex-1 rounded-2xl px-2 py-2 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 hover:bg-gray-700 ${
                    chat.id === currentChatId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-center">
                    <span className="truncate">
                      {chat.title || `Chat ${chat.id.slice(0, 8)}`}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </div>
                </button>
                <button
                  className="absolute right-2 cursor-pointer px-2 py-1 text-xs text-red-400 opacity-0 transition-opacity duration-150 hover:text-red-500 group-hover:opacity-100"
                  onClick={() => onDeleteChat(chat.id)}
                  title="Delete chat"
                  disabled={loading}
                  tabIndex={-1}
                  aria-label="Delete chat"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
