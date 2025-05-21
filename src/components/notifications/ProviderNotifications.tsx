
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Calendar, Bell, CheckCircle, AlertCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "job",
    title: "New Job Application Response",
    message: "Your application for 'Kitchen Repainting' job has been accepted. Contact the customer to schedule.",
    timestamp: "2025-05-11T09:30:00",
    isRead: false,
    relatedId: "job1",
    actions: ["contact", "view"]
  },
  {
    id: "n2",
    type: "message",
    title: "New Message from Sandra",
    message: "Sandra East sent you a message regarding the wall painting job.",
    timestamp: "2025-05-10T14:22:00",
    isRead: false,
    relatedId: "conv1",
    actions: ["reply"]
  },
  {
    id: "n3",
    type: "payment",
    title: "Payment Received",
    message: "You've received a payment of $120.00 for 'House Painting' job.",
    timestamp: "2025-05-09T08:15:00",
    isRead: true,
    relatedId: "payment1",
    actions: ["view"]
  },
  {
    id: "n4",
    type: "review",
    title: "New Review Received",
    message: "Sandra East left a 5-star review for your 'Wall Repairs' service.",
    timestamp: "2025-05-08T16:45:00",
    isRead: true,
    relatedId: "review1",
    actions: ["view", "respond"]
  },
  {
    id: "n5",
    type: "subscription",
    title: "Weekly Subscription Active",
    message: "Your Weekly Subscription plan is active. Your profile is now receiving priority placement in search results.",
    timestamp: "2025-05-07T11:10:00",
    isRead: true,
    actions: []
  }
];

type NotificationType = "all" | "unread" | "job" | "message" | "payment" | "review" | "subscription";

export function ProviderNotifications() {
  const [activeTab, setActiveTab] = useState<NotificationType>("all");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const navigate = useNavigate();
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };
  
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const handleAction = (notification: typeof MOCK_NOTIFICATIONS[0], action: string) => {
    // Mark as read first
    handleMarkAsRead(notification.id);
    
    // Then perform action
    switch(action) {
      case "contact":
      case "reply":
        // Navigate to messages
        toast({
          title: "Opening chat",
          description: "Redirecting to the conversation",
        });
        navigate(`/provider/messages`);
        break;
      case "view":
        // Navigate based on type
        if (notification.type === "job") {
          toast({
            title: "Viewing job details",
            description: "Redirecting to job information"
          });
          navigate(`/provider/jobs/${notification.relatedId}`);
        } else if (notification.type === "payment") {
          toast({
            title: "Viewing payment details",
            description: "Redirecting to earnings information"
          });
          navigate(`/provider/profile?tab=earnings`);
        } else if (notification.type === "review") {
          toast({
            title: "Viewing review",
            description: "Redirecting to review details"
          });
          navigate(`/provider/profile?tab=reviews`);
        }
        break;
      case "respond":
        // Navigate to review response
        toast({
          title: "Responding to review",
          description: "Prepare your response"
        });
        navigate(`/provider/profile?tab=reviews&respond=${notification.relatedId}`);
        break;
      default:
        break;
    }
  };
  
  const renderIcon = (type: string) => {
    switch(type) {
      case "job":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "payment":
        return <Bell className="h-5 w-5 text-orange-500" />;
      case "review":
        return <CheckCircle className="h-5 w-5 text-yellow-500" />;
      case "subscription":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Business Notifications</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
          >
            Mark all as read
          </Button>
        </div>
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as NotificationType)}>
          <TabsList className="grid grid-cols-4 md:grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {notifications.some(n => !n.isRead) && (
                <Badge variant="destructive" className="ml-2">
                  {notifications.filter(n => !n.isRead).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="job">Jobs</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="payment" className="hidden md:inline-flex">Payments</TabsTrigger>
            <TabsTrigger value="review" className="hidden md:inline-flex">Reviews</TabsTrigger>
            <TabsTrigger value="subscription" className="hidden md:inline-flex">Subscription</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg ${!notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {renderIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-base font-semibold ${!notification.isRead ? 'text-blue-700' : ''}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {getRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex flex-wrap justify-end gap-2 mt-3">
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      {notification.actions?.includes("contact") && (
                        <Button 
                          size="sm"
                          onClick={() => handleAction(notification, "contact")}
                        >
                          Contact Customer
                        </Button>
                      )}
                      {notification.actions?.includes("reply") && (
                        <Button 
                          size="sm"
                          onClick={() => handleAction(notification, "reply")}
                        >
                          Reply
                        </Button>
                      )}
                      {notification.actions?.includes("view") && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(notification, "view")}
                        >
                          View Details
                        </Button>
                      )}
                      {notification.actions?.includes("respond") && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(notification, "respond")}
                        >
                          Respond
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No notifications</h3>
            <p className="text-gray-500 mt-1">You're all caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
