
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface Message {
  id: number;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessageText: string;
  lastMessageTimestamp: string;
  hasUnreadMessages: boolean;
  relatedToBooking?: string;
}

interface MessageContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => Message | null;
  getConversation: (conversationId: string) => Conversation | null;
  getConversationMessages: (conversationId: string) => Message[];
  getUserConversations: (userId: string) => Conversation[];
  markConversationAsRead: (conversationId: string, userId: string) => void;
  startNewConversation: (participantIds: string[], initialMessage: string, bookingId?: string) => Conversation;
}

// Mock conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    participants: ["c456", "b123"],
    lastMessageText: "When can you come to check the walls?",
    lastMessageTimestamp: "2025-05-07T10:40:00",
    hasUnreadMessages: true,
    relatedToBooking: "1"
  },
  {
    id: "conv2",
    participants: ["c457", "b123"],
    lastMessageText: "Thanks for the quick response!",
    lastMessageTimestamp: "2025-05-06T15:22:00",
    hasUnreadMessages: false
  },
  {
    id: "conv3",
    participants: ["c459", "b123"],
    lastMessageText: "The mural looks amazing! Thank you so much!",
    lastMessageTimestamp: "2025-05-05T09:18:00",
    hasUnreadMessages: false,
    relatedToBooking: "6"
  }
];

// Mock messages for conversations
const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv1": [
    {
      id: 1,
      conversationId: "conv1",
      senderId: "c456",
      text: "Hi, I'm interested in your wall painting service",
      timestamp: "2025-05-07T10:30:00",
      isRead: true
    },
    {
      id: 2,
      conversationId: "conv1",
      senderId: "b123",
      text: "Hello Sandra! I'd be happy to help with your painting needs. What kind of painting job do you have in mind?",
      timestamp: "2025-05-07T10:32:00",
      isRead: true
    },
    {
      id: 3,
      conversationId: "conv1",
      senderId: "c456",
      text: "I need to repaint my living room walls. They're around 400 sq ft total.",
      timestamp: "2025-05-07T10:35:00",
      isRead: true
    },
    {
      id: 4,
      conversationId: "conv1",
      senderId: "b123",
      text: "I can definitely help with that. What color are you thinking of?",
      timestamp: "2025-05-07T10:38:00",
      isRead: true
    },
    {
      id: 5,
      conversationId: "conv1",
      senderId: "c456",
      text: "When can you come to check the walls?",
      timestamp: "2025-05-07T10:40:00",
      isRead: false
    }
  ],
  "conv2": [
    {
      id: 1,
      conversationId: "conv2",
      senderId: "c457",
      text: "Hello, do you offer wall repair services?",
      timestamp: "2025-05-06T15:10:00",
      isRead: true
    },
    {
      id: 2,
      conversationId: "conv2",
      senderId: "b123",
      text: "Yes, we do! What kind of repair do you need?",
      timestamp: "2025-05-06T15:12:00",
      isRead: true
    },
    {
      id: 3,
      conversationId: "conv2",
      senderId: "c457",
      text: "I have a few holes in my drywall that need patching.",
      timestamp: "2025-05-06T15:15:00",
      isRead: true
    },
    {
      id: 4,
      conversationId: "conv2",
      senderId: "b123",
      text: "We can definitely help with that. Our rate for drywall repair is $75/hour, and most small patches can be done in 1-2 hours.",
      timestamp: "2025-05-06T15:20:00",
      isRead: true
    },
    {
      id: 5,
      conversationId: "conv2",
      senderId: "c457",
      text: "Thanks for the quick response!",
      timestamp: "2025-05-06T15:22:00",
      isRead: true
    }
  ],
  "conv3": [
    {
      id: 1,
      conversationId: "conv3",
      senderId: "c459",
      text: "I wanted to thank you for the beautiful mural you painted in my daughter's room.",
      timestamp: "2025-05-05T09:10:00",
      isRead: true
    },
    {
      id: 2,
      conversationId: "conv3",
      senderId: "b123",
      text: "You're very welcome, Julia! I'm glad she likes it.",
      timestamp: "2025-05-05T09:12:00",
      isRead: true
    },
    {
      id: 3,
      conversationId: "conv3",
      senderId: "c459",
      text: "She absolutely loves it. Would you be available to do another one in our basement?",
      timestamp: "2025-05-05T09:15:00",
      isRead: true
    },
    {
      id: 4,
      conversationId: "conv3",
      senderId: "b123",
      text: "I'd be happy to! Let's schedule a time for me to come take a look at the space.",
      timestamp: "2025-05-05T09:17:00",
      isRead: true
    },
    {
      id: 5,
      conversationId: "conv3",
      senderId: "c459",
      text: "The mural looks amazing! Thank you so much!",
      timestamp: "2025-05-05T09:18:00",
      isRead: true
    }
  ]
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

  // Send a new message
  const sendMessage = (conversationId: string, text: string): Message | null => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return null;
    }
    
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) {
      toast.error("Conversation not found");
      return null;
    }
    
    const newMessage: Message = {
      id: Date.now(),
      conversationId,
      senderId: user.id,
      text,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    // Update messages
    setMessages(prevMessages => {
      const conversationMessages = prevMessages[conversationId] || [];
      return {
        ...prevMessages,
        [conversationId]: [...conversationMessages, newMessage]
      };
    });
    
    // Update conversation last message
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId
          ? {
              ...conv,
              lastMessageText: text,
              lastMessageTimestamp: newMessage.timestamp,
              hasUnreadMessages: true
            }
          : conv
      )
    );
    
    return newMessage;
  };

  // Get a specific conversation
  const getConversation = (conversationId: string): Conversation | null => {
    return conversations.find(conv => conv.id === conversationId) || null;
  };

  // Get messages for a specific conversation
  const getConversationMessages = (conversationId: string): Message[] => {
    return messages[conversationId] || [];
  };

  // Get all conversations for a user
  const getUserConversations = (userId: string): Conversation[] => {
    return conversations.filter(conv => conv.participants.includes(userId));
  };

  // Mark a conversation as read
  const markConversationAsRead = (conversationId: string, userId: string) => {
    // Update conversation
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId
          ? { ...conv, hasUnreadMessages: false }
          : conv
      )
    );
    
    // Update messages
    setMessages(prevMessages => {
      const conversationMessages = prevMessages[conversationId];
      if (!conversationMessages) return prevMessages;
      
      return {
        ...prevMessages,
        [conversationId]: conversationMessages.map(msg => 
          msg.senderId !== userId && !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        )
      };
    });
  };

  // Start a new conversation
  const startNewConversation = (participantIds: string[], initialMessage: string, bookingId?: string): Conversation => {
    if (!user) {
      toast.error("You must be logged in to start conversations");
      throw new Error("User not authenticated");
    }
    
    // Create the new conversation
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      participants: participantIds,
      lastMessageText: initialMessage,
      lastMessageTimestamp: new Date().toISOString(),
      hasUnreadMessages: true,
      relatedToBooking: bookingId
    };
    
    // Create the initial message
    const newMessage: Message = {
      id: Date.now(),
      conversationId: newConversationId,
      senderId: user.id,
      text: initialMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    // Update state
    setConversations(prevConversations => [...prevConversations, newConversation]);
    setMessages(prevMessages => ({
      ...prevMessages,
      [newConversationId]: [newMessage]
    }));
    
    toast.success("New conversation started");
    return newConversation;
  };

  return (
    <MessageContext.Provider value={{
      conversations,
      messages,
      sendMessage,
      getConversation,
      getConversationMessages,
      getUserConversations,
      markConversationAsRead,
      startNewConversation
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}
