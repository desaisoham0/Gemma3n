import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useChatDb } from "./useChatDb";
import type { Chat, Message } from "../types";

export function useChatManager() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);

  const {
    createNewChat: dbCreateNewChat,
    addMessageToChat,
    getChatMessages,
    getAllChatsList,
    deleteChatById: dbDeleteChatById,
  } = useChatDb();

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
    // Don't create the chat in DB yet - wait for first message
  }, []);

  // Function to select an existing chat
  const handleSelectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  // Function to delete a chat
  const handleDeleteChat = useCallback(
    (chatId: string) => {
      dbDeleteChatById(chatId);
      // If the deleted chat is the current one, clear the selection
      if (currentChatId === chatId) {
        setCurrentChatId("");
        setCurrentChatMessages([]);
      }
      // Refresh chat list
      const updatedChats = getAllChatsList();
      setChats(updatedChats);
    },
    [dbDeleteChatById, getAllChatsList, currentChatId],
  );

  // Function to create chat in database (used when first message is sent)
  const createChatInDb = useCallback(
    (chatId: string, title: string) => {
      dbCreateNewChat(chatId, title);
      // Refresh chats list
      const updatedChats = getAllChatsList();
      setChats(updatedChats);
    },
    [dbCreateNewChat, getAllChatsList],
  );

  // Function to add message and update state
  const addMessage = useCallback(
    (chatId: string, message: Message) => {
      addMessageToChat(chatId, message.role, message.content);

      // Update local state
      setCurrentChatMessages((prev) => [...prev, message]);

      // Refresh chats list to update timestamps
      const refreshedChats = getAllChatsList();
      setChats(refreshedChats);
    },
    [addMessageToChat, getAllChatsList],
  );

  return {
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
  };
}
