
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
import { MessageSquare, Calendar, Bell, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your appointment with John's Paintin' has been confirmed for May 15th, 2025 at 10:00 AM.",
    timestamp: "2025-05-11T09:30:00",
    isRead: false,
    relatedId: "1"
  },
  {
    id: "n2",
    type: "message",
    title: "New Message",
    message: "John from John's Paintin' sent you a message about your upcoming appointment.",
    timestamp: "2025-05-10T14:22:00",
    isRead: false,
    relatedId: "conv1"
  },
  {
    id: "n3",
    type: "subscription",
    title: "Weekly Subscription Renewed",
    message: "Your Weekly Subscription has been successfully renewed. Next billing date: June 11th, 2025.",
    timestamp: "2025-05-09T08:15:00",
    isRead: true
  },
  {
    id: "n4",
    type: "review",
    title: "Review Request",
    message: "How was your experience with CleanPro Services? Please leave a review.",
    timestamp: "2025-05-08T16:45:00",
    isRead: true,
    relatedId: "4"
  },
  {
    id: "n5",
    type: "system",
    title: "System Update",
    message: "We've made some improvements to our booking system. Check it out!",
    timestamp: "2025-05-07T11:10:00",
    isRead: true
  }
];

type NotificationType = "all" | "unread" | "booking" | "message" | "subscription" | "review" | "system";

export function ConsumerNotifications() {
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
  
  const handleAction = (notification: typeof MOCK_NOTIFICATIONS[0]) => {
    // Mark as read first
    handleMarkAsRead(notification.id);
    
    // Then navigate based on type
    switch(notification.type) {
      case "booking":
        // Navigate to booking details - fixing navigation path
        toast.success("Navigating to booking details");
        navigate(`/consumer/dashboard?booking=${notification.relatedId}`);
        break;
      case "message":
        // Navigate to conversation - fixing navigation path
        toast.success("Opening chat");
        navigate(`/consumer/messages/${notification.relatedId}`);
        break;
      case "review":
        // Navigate to leave review - fixing navigation path
        toast.success("Opening review page");
        navigate(`/consumer/review/${notification.relatedId}`);
        break;
      default:
        // Just mark as read for other notification types
        break;
    }
  };
  
  const renderIcon = (type: string) => {
    switch(type) {
      case "booking":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "subscription":
        return <Bell className="h-5 w-5 text-purple-500" />;
      case "review":
        return <CheckCircle className="h-5 w-5 text-yellow-500" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
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
          <CardTitle>Your Notifications</CardTitle>
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
            <TabsTrigger value="booking">Bookings</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="subscription" className="hidden md:inline-flex">Subscription</TabsTrigger>
            <TabsTrigger value="review" className="hidden md:inline-flex">Reviews</TabsTrigger>
            <TabsTrigger value="system" className="hidden md:inline-flex">System</TabsTrigger>
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
                    <div className="flex justify-end gap-2 mt-3">
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      {(notification.type === "booking" || notification.type === "message" || notification.type === "review") && (
                        <Button 
                          size="sm"
                          onClick={() => handleAction(notification)}
                        >
                          {notification.type === "booking" ? "View Booking" : 
                           notification.type === "message" ? "Open Chat" : 
                           "Leave Review"}
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
