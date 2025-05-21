
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "@/components/BookingCard";
import { Star, Calendar } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function ConsumerProfile() {
  const { user } = useAuth();
  const { 
    getUpcomingBookings,
    getCompletedBookings,
    getCanceledBookings
  } = useBooking();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "canceled">("upcoming");
  
  // Get bookings based on active tab
  const getFilteredBookings = () => {
    if (!user) return [];
    
    if (activeTab === "upcoming") {
      return getUpcomingBookings(user.id, 'consumer');
    } else if (activeTab === "completed") {
      return getCompletedBookings(user.id, 'consumer');
    } else {
      return getCanceledBookings(user.id, 'consumer');
    }
  };
  
  const filteredBookings = getFilteredBookings();

  // Mock subscription data - in a real app this would come from the user object or context
  const subscriptionData = {
    active: true,
    type: "Basic Weekly",
    nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    startedOn: new Date().toLocaleDateString()
  };

  // Mock consumer data with defaults for TypeScript
  const consumerData = {
    recentBookings: 3,
    totalSpent: 125
  };

  return (
    <div>
      <AppHeader />
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Card */}
          <Card className="w-full md:w-1/3 p-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{user?.name || "User Name"}</h2>
              <p className="text-gray-500">{user?.email || "email@example.com"}</p>
              
              {subscriptionData.active && (
                <div className="mt-4 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="subscription">Weekly Subscriber</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {subscriptionData.type} · Next billing: {subscriptionData.nextBillingDate}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => navigate('/subscriptions')}
                  >
                    Manage Subscription
                  </Button>
                </div>
              )}
              
              <div className="mt-6 w-full">
                <h3 className="font-semibold mb-2">My Reviews</h3>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-5 w-5 ${star <= (user?.averageRating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {user?.averageRating || 4.0} ({user?.reviewCount || 12} reviews)
                  </span>
                </div>
                
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-sm">Phone: {user?.phone || "(555) 123-4567"}</p>
                <p className="text-sm">Location: {user?.location || "San Francisco, CA"}</p>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Activity Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-hustlr-light-purple/30 p-3 rounded-lg text-center">
                      <p className="text-xl font-bold">{consumerData.recentBookings}</p>
                      <p className="text-sm">Recent Bookings</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg text-center">
                      <p className="text-xl font-bold">${consumerData.totalSpent}</p>
                      <p className="text-sm">Total Spent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Bookings Section */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "upcoming" | "completed" | "canceled")}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="canceled">Canceled</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="mt-4">
                <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <BookingCard 
                        key={booking.id} 
                        id={booking.id}
                        serviceName={booking.serviceName}
                        providerName={booking.providerName}
                        date={booking.date}
                        time={booking.time}
                        status="upcoming"
                        price={booking.price}
                      />
                    ))
                  ) : (
                    <p>No upcoming bookings</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="completed" className="mt-4">
                <h2 className="text-xl font-bold mb-4">Completed Bookings</h2>
                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <BookingCard 
                        key={booking.id} 
                        id={booking.id}
                        serviceName={booking.serviceName}
                        providerName={booking.providerName}
                        date={booking.date}
                        time={booking.time}
                        status="completed"
                        price={booking.price}
                      />
                    ))
                  ) : (
                    <p>No completed bookings</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="canceled" className="mt-4">
                <h2 className="text-xl font-bold mb-4">Canceled Bookings</h2>
                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <BookingCard 
                        key={booking.id} 
                        id={booking.id}
                        serviceName={booking.serviceName}
                        providerName={booking.providerName}
                        date={booking.date}
                        time={booking.time}
                        status="canceled"
                        price={booking.price}
                      />
                    ))
                  ) : (
                    <p>No canceled bookings</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
