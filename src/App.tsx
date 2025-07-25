import React, { useState, useEffect, useCallback } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { fetchOllamaResponse } from "./utils/api";
import type { Message } from "./types";
import { Bars3Icon, XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { systemPrompt } from "./systemPrompt";
import { useChatDb } from "./hooks/useChatDb";
import { v4 as uuidv4 } from "uuid";

type Chat = {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
}

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { createNewChat, addMessageToChat, getChatMessages, getAllChatsList } = useChatDb();

  // Load chats from database
  useEffect(() => {
    const loadChats = () => {
      const dbChats = getAllChatsList();
      setChats(dbChats);
    };
    
    loadChats();
  }, [getAllChatsList]);

  // Load messages for current chat
  useEffect(() => {
    if (currentChatId) {
      const messages = getChatMessages(currentChatId);
      console.log("Loaded messages for chat:", currentChatId, messages);
      setCurrentChatMessages(messages);
    } else {
      setCurrentChatMessages([]);
    }
  }, [currentChatId, getChatMessages]);

  // Function to create a new chat
  const handleNewChat = useCallback(() => {
    const newChatId = uuidv4();
    setCurrentChatId(newChatId);
    setCurrentChatMessages([]);
    setSidebarOpen(false);
    // Don't create the chat in DB yet - wait for first message
  }, []);

  // Function to select an existing chat
  const handleSelectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false);
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    let chatId = currentChatId;

    // If no chatId or chat doesn't exist in DB, create a new one
    if (!chatId || !chats.find((c) => c.id === chatId)) {
      chatId = uuidv4();
      
      // Create chat title from first message (truncated to 50 chars)
      const chatTitle = userMessage.length > 50 
        ? userMessage.substring(0, 47) + "..." 
        : userMessage;
      
      // Create new chat in database
      createNewChat(chatId, chatTitle);
      setCurrentChatId(chatId);
      
      // Refresh chats list
      const updatedChats = getAllChatsList();
      setChats(updatedChats);
    }
    
    const userMsg: Message = { 
      role: "user", 
      content: userMessage
    };
    
    // Add user message to database and update state
    addMessageToChat(chatId, userMsg.role, userMsg.content);
    const updatedMessages = [systemPrompt, ...currentChatMessages, userMsg];
    setCurrentChatMessages(updatedMessages);
    
    try {
      const aiContent = await fetchOllamaResponse(updatedMessages);
      const aiMsg: Message = { role: "assistant", content: aiContent };
      
      // Add AI response to database
      addMessageToChat(chatId, aiMsg.role, aiMsg.content);
      
      // Update state with AI response
      setCurrentChatMessages([...updatedMessages, aiMsg]);
      
      // Refresh chats list to update timestamps
      const refreshedChats = getAllChatsList();
      setChats(refreshedChats);
      
    } catch (err) {
      console.error("Error fetching response:", err);
      const errorMsg: Message = { 
        role: "assistant", 
        content: "Error: Could not get response. Please check if Ollama is running and the model is available." 
      };
      
      // Add error message to database
      addMessageToChat(chatId, errorMsg.role, errorMsg.content);
      
      // Update state with error message
      setCurrentChatMessages([...updatedMessages, errorMsg]);
      
      // Refresh chats list
      const refreshedChats = getAllChatsList();
      setChats(refreshedChats);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#131f24] flex flex-col">
      {/* Sidebar toggle button */}
      {!sidebarOpen && (
        <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
          <button
            className="p-2 bg-gray-800 text-gray-200 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <button
            className="p-2 bg-gray-800 text-gray-200 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNewChat}
            disabled={loading}
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#131f24] text-gray-200 shadow-xl z-40 transform transition-transform duration-300 border-r border-gray-700 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg text-gray-100">Chat Menu</h2>
            <p className="text-sm text-gray-400">Manage conversations</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="text-gray-400 hover:text-gray-200 cursor-pointer p-1 rounded hover:bg-gray-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="p-4 space-y-3">
          <button
            className="w-full px-3 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer text-sm font-medium transition-colors duration-200 disabled:opacity-50"
            onClick={handleNewChat}
            disabled={loading}
          >
            Start New Chat
          </button>
          
          {/* List of chats */}
          <div className="mt-4 space-y-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2">
              Chat History
            </h3>
            {chats.length === 0 ? (
              <p className="text-sm text-gray-500 px-2 py-2">No chats yet</p>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-200 hover:bg-gray-700 ${
                    chat.id === currentChatId 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-800 text-gray-200"
                  }`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <div className="truncate">
                    {chat.title || `Chat ${chat.id.slice(0, 8)}`}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-label="sidebar-overlay"
        />
      )}

      {/* Main Content */}
      {currentChatMessages.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 pt-8 pb-64">
            <div className="w-full max-w-6xl mx-auto">
              <ChatWindow 
                messages={currentChatMessages.filter(msg => msg.role !== "system")} 
                loading={loading} 
              />
            </div>
          </div>
          <div className="fixed bottom-0 w-full bg-transparent">
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={sendMessage}
              disabled={loading}
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl flex flex-col items-center text-center">
            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-100 mb-2">
                Welcome to Chat
              </h1>
              <p className="text-sm text-gray-400">
                Start a conversation by typing a message below
              </p>
            </div>
            <div className="w-full">
              <ChatInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSubmit={sendMessage}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;