import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { fetchOllamaResponse } from "../utils/api";
import { AI_MODES, type AiMode } from "../config/aiModes";
import type { Message, Chat } from "../types";

interface UseChatMessagingProps {
  currentChatId: string;
  currentChatMessages: Message[];
  setCurrentChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chats: Chat[];
  createChatInDb: (chatId: string, title: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  setCurrentChatId: (chatId: string) => void;
}

export function useChatMessaging({
  currentChatId,
  currentChatMessages,
  setCurrentChatMessages,
  chats,
  createChatInDb,
  addMessage,
  setCurrentChatId,
}: UseChatMessagingProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<AiMode>(AI_MODES[0]);

  // Handle AI mode change
  const handleModeChange = useCallback((mode: AiMode) => {
    setSelectedMode(mode);
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || loading) return;

      setLoading(true);
      let chatId = currentChatId;

      // If no chatId or chat doesn't exist in DB, create a new one
      if (!chatId || !chats.find((c) => c.id === chatId)) {
        chatId = uuidv4();

        // Create chat title from first message (truncated to 25 chars)
        const chatTitle =
          userMessage.length > 25
            ? userMessage.substring(0, 25) + "..."
            : userMessage;

        // Create new chat in database
        createChatInDb(chatId, chatTitle);
        setCurrentChatId(chatId);
      }

      const userMsg: Message = {
        role: "user",
        content: userMessage,
      };

      // Add user message to database and update state
      addMessage(chatId, userMsg);

      // Use selected AI mode's system prompt
      const updatedMessages = [
        selectedMode.systemPrompt,
        ...currentChatMessages,
        userMsg,
      ];
      setCurrentChatMessages(updatedMessages);

      try {
        const aiContent = await fetchOllamaResponse(updatedMessages);
        const aiMsg: Message = { role: "assistant", content: aiContent };

        // Add AI response to database and update state
        addMessage(chatId, aiMsg);
      } catch (err) {
        console.error("Error fetching response:", err);
        const errorMsg: Message = {
          role: "assistant",
          content:
            "Error: Could not get response. Please check if Ollama is running and the model is available.",
        };

        // Add error message to database and update state
        addMessage(chatId, errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      currentChatId,
      chats,
      currentChatMessages,
      selectedMode,
      createChatInDb,
      addMessage,
      setCurrentChatMessages,
      setCurrentChatId,
    ],
  );

  return {
    loading,
    selectedMode,
    handleModeChange,
    sendMessage,
  };
}
