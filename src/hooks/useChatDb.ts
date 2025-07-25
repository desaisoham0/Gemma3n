import { useState, useEffect, useCallback } from 'react';
import { initChatTables, createChat, addMessage, getMessages, getAllChats, updateChatTimestamp } from '../db';
import type { Database } from 'sql.js';
import type { Message } from '../types';

export function useChatDb() {
  const [db, setDb] = useState<Database | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initChatTables()
      .then((database) => {
        setDb(database);
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error('Failed to initialize database:', error);
      });
  }, []);

  const createNewChat = useCallback((id: string, title: string) => {
    if (!db || !isInitialized) {
      console.warn('Database not initialized yet');
      return;
    }
    try {
      createChat(db, id, title);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  }, [db, isInitialized]);

  const addMessageToChat = useCallback((chatId: string, role: string, content: string) => {
    if (!db || !isInitialized) {
      console.warn('Database not initialized yet');
      return;
    }
    try {
      addMessage(db, chatId, role, content);
    } catch (error) {
      console.error('Error adding message to chat:', error);
    }
  }, [db, isInitialized]);

  const getChatMessages = useCallback((chatId: string): Message[] => {
    if (!db || !isInitialized) {
      console.warn('Database not initialized yet');
      return [];
    }
    try {
      const messages = getMessages(db, chatId);
      return messages.map(msg => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      }));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }, [db, isInitialized]);

  const getAllChatsList = useCallback(() => {
    if (!db || !isInitialized) {
      console.warn('Database not initialized yet');
      return [];
    }
    try {
      return getAllChats(db);
    } catch (error) {
      console.error('Error getting all chats:', error);
      return [];
    }
  }, [db, isInitialized]);

  const updateChatTitle = useCallback((chatId: string, newTitle: string) => {
    if (!db || !isInitialized) {
      console.warn('Database not initialized yet');
      return;
    }
    try {
      db.run('UPDATE chats SET title = ? WHERE id = ?', [newTitle, chatId]);
      updateChatTimestamp(db, chatId);
    } catch (error) {
      console.error('Error updating chat title:', error);
    }
  }, [db, isInitialized]);

  const deleteChatById = useCallback((chatId: string) => {
    if (!db || !isInitialized) {
      console.warn('Database not initialized yet');
      return;
    }
    try {
      // Delete messages first (due to foreign key constraint)
      db.run('DELETE FROM messages WHERE chat_id = ?', [chatId]);
      // Then delete the chat
      db.run('DELETE FROM chats WHERE id = ?', [chatId]);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }, [db, isInitialized]);

  return { 
    createNewChat, 
    addMessageToChat, 
    getChatMessages, 
    getAllChatsList,
    updateChatTitle,
    deleteChatById,
    isDbReady: isInitialized
  };
}