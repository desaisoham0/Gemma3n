import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { SidebarToggle } from "./components/SidebarToggle";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ChatLayout } from "./components/ChatLayout";
import { AI_MODES } from "./config/aiModes";
import { useChatManager } from "./hooks/useChatManager";
import { useChatMessaging } from "./hooks/useChatMessaging";
import { useSidebar } from "./hooks/useSidebar";

function App() {
  const [input, setInput] = useState("");

  // Custom hooks for different concerns
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const {
    chats,
    currentChatId,
    currentChatMessages,
    setCurrentChatMessages,
    setCurrentChatId,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    createChatInDb,
    addMessage,
  } = useChatManager();

  const { loading, selectedMode, handleModeChange, sendMessage } =
    useChatMessaging({
      currentChatId,
      currentChatMessages,
      setCurrentChatMessages,
      chats,
      createChatInDb,
      addMessage,
      setCurrentChatId,
    });

  const handleNewChatWithReset = () => {
    handleNewChat();
    handleModeChange(AI_MODES[0]); // Reset to default mode
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage);
  };

  const handleNewChatWithSidebarClose = () => {
    handleNewChatWithReset();
    closeSidebar();
  };

  const handleSelectChatWithSidebarClose = (chatId: string) => {
    handleSelectChat(chatId);
    closeSidebar();
  };

  return (
    <div className="min-h-screen w-full bg-[#131f24] flex flex-col">
      {/* Sidebar toggle button */}
      {!sidebarOpen && (
        <SidebarToggle
          onToggleSidebar={toggleSidebar}
          onNewChat={handleNewChatWithReset}
          loading={loading}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChatWithSidebarClose}
        onNewChat={handleNewChatWithSidebarClose}
        onDeleteChat={handleDeleteChat}
        loading={loading}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeSidebar}
          aria-label="sidebar-overlay"
        />
      )}

      {/* Main Content */}
      {currentChatMessages.length > 0 ? (
        <ChatLayout
          messages={currentChatMessages}
          loading={loading}
          input={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
        />
      ) : (
        <WelcomeScreen
          input={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          disabled={loading}
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
        />
      )}
    </div>
  );
}

export default App;
