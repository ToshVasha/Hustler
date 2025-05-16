
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useMessage, Message } from "@/contexts/MessageContext";
import { Send, Info } from "lucide-react";
import { Link } from "react-router-dom";

interface MessagingPanelProps {
  conversationId: string;
  recipientId?: string;
  recipientName?: string;
  initialMessages?: Message[];
  serviceId?: string;
}

export function MessagingPanel({ 
  conversationId,
  recipientId,
  recipientName,
  initialMessages = [],
  serviceId
}: MessagingPanelProps) {
  const { user } = useAuth();
  const { sendMessage, getConversationMessages, markConversationAsRead } = useMessage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get messages from context if conversationId is provided
    if (conversationId && conversationId !== "new") {
      const conversationMessages = getConversationMessages(conversationId);
      setMessages(conversationMessages);
      
      // Mark messages as read
      if (user) {
        markConversationAsRead(conversationId, user.id);
      }
    } else if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [conversationId, initialMessages, getConversationMessages, markConversationAsRead, user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    if (conversationId && conversationId !== "new") {
      const sentMessage = sendMessage(conversationId, message);
      if (sentMessage) {
        setMessages(prev => [...prev, sentMessage]);
      }
    } else {
      // Handle new conversation case
      const newMessage: Message = {
        id: Date.now(),
        conversationId: "temp",
        senderId: user.id,
        text: message,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, newMessage]);
    }
    
    setMessage("");
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timestamp; // Fallback to raw timestamp if parsing fails
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="" />
            <AvatarFallback>{recipientName ? recipientName[0]?.toUpperCase() || 'U' : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{recipientName || "New Conversation"}</h3>
            <p className="text-xs text-gray-500">
              {recipientId ? "Online" : "Start a conversation"}
            </p>
          </div>
        </div>
        {serviceId && (
          <Link to={`/service/${serviceId}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Go to Service
            </Button>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-end">
                    {!isMe && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{recipientName ? recipientName[0]?.toUpperCase() || 'U' : 'U'}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-md rounded-lg px-4 py-2 ${
                      isMe ? 'bg-hustlr-purple text-white' : 'bg-gray-100'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-hustlr-light-gray' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                    {isMe && (
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarImage src={user?.avatar || ""} />
                        <AvatarFallback>{user?.name?.[0].toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Send className="h-10 w-10 text-hustlr-purple" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-gray-500 max-w-md">
              Start a conversation with a service provider to get quick assistance or quotes.
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex">
          <Textarea
            placeholder="Type your message..."
            className="resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            className="ml-2"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
