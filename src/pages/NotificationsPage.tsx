
import React from "react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { ConsumerNotifications } from "@/components/notifications/ConsumerNotifications";
import { ProviderNotifications } from "@/components/notifications/ProviderNotifications";

export default function NotificationsPage() {
  const { userType } = useAuth();
  
  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        
        {userType === 'consumer' ? (
          <ConsumerNotifications />
        ) : (
          <ProviderNotifications />
        )}
      </div>
    </div>
  );
}
