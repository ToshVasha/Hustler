
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessage, Conversation } from "@/contexts/MessageContext";
import { AppHeader } from "@/components/AppHeader";
import { MessagingPanel } from "@/components/MessagingPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Plus, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Mock notification data
const notifications = [
  {
    id: "n1",
    type: "message",
    content: "New message from Sandra East",
    time: "2 minutes ago",
    isRead: false,
    conversationId: "conv1"
  },
  {
    id: "n2",
    type: "message",
    content: "New message from Michael West",
    time: "1 hour ago",
    isRead: true,
    conversationId: "conv2"
  }
];

export default function ProviderChat() {
  const { user } = useAuth();
  const { getUserConversations, getConversation, getConversationMessages } = useMessage();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [recipientName, setRecipientName] = useState<string>("");
  const [unreadNotifications, setUnreadNotifications] = useState(
    notifications.filter(n => !n.isRead).length
  );
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Load conversations
  useEffect(() => {
    if (user) {
      const userConversations = getUserConversations(user.id);
      setConversations(userConversations);
      
      // Set first conversation as active by default if none selected
      if (userConversations.length > 0 && !activeConversationId) {
        setActiveConversationId(userConversations[0].id);
      }
    }
  }, [user, getUserConversations, activeConversationId]);
  
  // Set active conversation when ID changes
  useEffect(() => {
    if (activeConversationId) {
      const conversation = getConversation(activeConversationId);
      setActiveConversation(conversation);
      
      // Find recipient name based on conversation participants
      if (conversation && user) {
        // In a real app, you would fetch user details from a backend
        // For demo, we'll use placeholder names based on IDs
        const recipientId = conversation.participants.find(id => id !== user.id);
        if (recipientId) {
          if (recipientId === "c456") {
            setRecipientName("Sandra East");
          } else if (recipientId === "c457") {
            setRecipientName("Michael West");
          } else if (recipientId === "c459") {
            setRecipientName("Julia South");
          } else {
            setRecipientName(`User ${recipientId.substring(0, 4)}`);
          }
        }
      }
    } else {
      setActiveConversation(null);
      setRecipientName("");
    }
  }, [activeConversationId, getConversation, user]);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    // In a real app, you would search in participant names
    // For demo, we'll search in the conversation ID and last message
    return (
      conversation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const today = new Date();
      
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (e) {
      return "";
    }
  };
  
  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? {...n, isRead: true} : n
    );
    
    // Update unread count
    setUnreadNotifications(updatedNotifications.filter(n => !n.isRead).length);
    
    // Set active conversation if it's a message notification
    if (notification.type === "message" && notification.conversationId) {
      setActiveConversationId(notification.conversationId);
    }
    
    // Hide notification panel
    setShowNotifications(false);
    
    toast.success("Notification marked as read");
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Provider Messages</h1>
          
          <div className="relative">
            <Button 
              variant="outline" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
                <div className="p-3 bg-gray-50 border-b">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className={`w-2 h-2 mt-2 rounded-full ${!notification.isRead ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          </div>
                          <div className="ml-2">
                            <p className="text-sm font-medium">{notification.content}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 bg-gray-50 border-t">
                  <Button variant="link" className="text-xs w-full" size="sm">
                    Mark all as read
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations Sidebar */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-200px)]">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> New Message
                  </Button>
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-72px)]">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    // Get recipient name (in a real app, fetch from user service)
                    let chatRecipientName = "Client";
                    if (user) {
                      const recipientId = conversation.participants.find(id => id !== user.id);
                      if (recipientId === "c456") {
                        chatRecipientName = "Sandra East";
                      } else if (recipientId === "c457") {
                        chatRecipientName = "Michael West";
                      } else if (recipientId === "c459") {
                        chatRecipientName = "Julia South";
                      } else if (recipientId) {
                        chatRecipientName = `User ${recipientId.substring(0, 4)}`;
                      }
                    }
                    
                    return (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          activeConversationId === conversation.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => setActiveConversationId(conversation.id)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {chatRecipientName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium">{chatRecipientName}</p>
                              <p className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessageTimestamp)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessageText}
                            </p>
                          </div>
                        </div>
                        {conversation.hasUnreadMessages && (
                          <span className="absolute top-4 right-4 h-2 w-2 bg-hustlr-purple rounded-full"></span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No conversations found
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Messaging Panel */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-200px)]">
              {activeConversationId && activeConversation ? (
                <MessagingPanel
                  conversationId={activeConversationId}
                  recipientName={recipientName}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mb-4" />
                  <p className="text-xl font-medium">Select a conversation to start messaging</p>
                  <p className="mt-2">
                    Or start a new conversation with a client
                  </p>
                  <Button className="mt-4">
                    New Message
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
