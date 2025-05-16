
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessage, Conversation } from "@/contexts/MessageContext";
import { AppHeader } from "@/components/AppHeader";
import { MessagingPanel } from "@/components/MessagingPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock service providers for new message dialog
const serviceProviders = [
  { id: "b123", name: "John's Paintin'", serviceId: "s1" },
  { id: "b124", name: "CleanPro Services", serviceId: "s4" },
  { id: "b125", name: "Quick Fix Plumbing", serviceId: "s5" },
  { id: "b126", name: "Bright Spark Electrical", serviceId: "s6" }
];

export default function MessagesPage() {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const { getUserConversations, getConversation, startNewConversation } = useMessage();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(
    user ? getUserConversations(user.id) : []
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversationId || (conversations.length > 0 ? conversations[0].id : null)
  );
  const [recipientName, setRecipientName] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  
  // New message dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  
  // Set active conversation details
  const activeConversation = activeConversationId
    ? getConversation(activeConversationId)
    : null;
    
  if (activeConversation && user) {
    // Determine recipient name based on conversation participants
    const recipientId = activeConversation.participants.find(id => id !== user.id);
    
    // Find matching provider from our mock data to set name and service ID
    const provider = serviceProviders.find(p => p.id === recipientId);
    
    if (provider && recipientName !== provider.name) {
      setRecipientName(provider.name);
      setServiceId(provider.serviceId);
    }
  }
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    // In a real app, this would search through participant names and message content
    return conversation.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Format timestamp to relative time
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
  
  // Handle creating a new conversation
  const handleCreateNewConversation = () => {
    if (!selectedProvider || !newMessageText.trim() || !user) {
      toast.error("Please select a provider and enter a message");
      return;
    }
    
    try {
      const newConversation = startNewConversation(
        [user.id, selectedProvider],
        newMessageText
      );
      
      // Update conversations list
      setConversations(prev => [newConversation, ...prev]);
      
      // Set active conversation to the new one
      setActiveConversationId(newConversation.id);
      
      // Find provider name for display
      const provider = serviceProviders.find(p => p.id === selectedProvider);
      if (provider) {
        setRecipientName(provider.name);
        setServiceId(provider.serviceId);
      }
      
      // Close dialog and reset fields
      setIsDialogOpen(false);
      setSelectedProvider("");
      setNewMessageText("");
      
      toast.success("New conversation started");
    } catch (error) {
      toast.error("Failed to start conversation");
    }
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">My Messages</h1>
        
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
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full flex items-center">
                        <Plus className="h-4 w-4 mr-2" /> New Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Message</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Service Provider</label>
                          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceProviders.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Message</label>
                          <Textarea
                            placeholder="Type your message here..."
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleCreateNewConversation} className="w-full">
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-72px)]">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    // Get recipient name (in a real app, fetch from user service)
                    let chatRecipientName = "Provider";
                    const provider = serviceProviders.find(p => 
                      conversation.participants.includes(p.id)
                    );
                    
                    if (provider) {
                      chatRecipientName = provider.name;
                    }
                    
                    return (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          activeConversationId === conversation.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          setActiveConversationId(conversation.id);
                          // Navigate to specific conversation URL
                          navigate(`/messages/${conversation.id}`);
                        }}
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
              {activeConversationId ? (
                <MessagingPanel
                  conversationId={activeConversationId}
                  recipientName={recipientName}
                  serviceId={serviceId}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mb-4" />
                  <p className="text-xl font-medium">No conversation selected</p>
                  <p className="mt-2 text-center max-w-md px-4">
                    Start a conversation with a service provider to get quick assistance or quotes.
                  </p>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-4">
                        New Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Message</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Service Provider</label>
                          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceProviders.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Message</label>
                          <Textarea
                            placeholder="Type your message here..."
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleCreateNewConversation} className="w-full">
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
