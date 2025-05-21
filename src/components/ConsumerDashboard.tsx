
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "@/components/BookingCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { Star, Calendar, ClipboardList, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function ConsumerDashboard() {
  const { user } = useAuth();
  const { getUpcomingBookings, getCompletedBookings, getCanceledBookings, updateBookingStatus } = useBooking();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "canceled">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year" | "all">("all");
  
  // Get bookings based on user ID and filter by search query and time period
  const getFilteredBookings = () => {
    if (!user) return [];
    
    let bookings = [];
    if (activeTab === "upcoming") {
      bookings = getUpcomingBookings(user.id, 'consumer');
    } else if (activeTab === "completed") {
      bookings = getCompletedBookings(user.id, 'consumer');
    } else {
      bookings = getCanceledBookings(user.id, 'consumer');
    }
    
    // Apply time filter
    if (timeFilter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (timeFilter === "week") {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (timeFilter === "month") {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (timeFilter === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      bookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= cutoffDate;
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      return bookings.filter(booking => 
        booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        booking.providerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return bookings;
  };

  const filteredBookings = getFilteredBookings();

  // Handle booking cancellation
  const handleCancelBooking = (id: string) => {
    const success = updateBookingStatus(id, "canceled");
    if (success) {
      toast.success("Booking canceled successfully");
    } else {
      toast.error("Failed to cancel booking");
    }
  };

  // Navigate to reviews page
  const handleViewProviderReviews = () => {
    navigate("/consumer/provider-reviews");
  };

  // Navigate to leave a review for completed booking
  const handleLeaveReview = (bookingId: string) => {
    navigate(`/consumer/review/${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Summary */}
          <Card className="w-full md:w-1/3 p-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{user?.name || "User Name"}</h2>
              <p className="text-gray-500">{user?.email || "email@example.com"}</p>
              
              <div className="mt-6 w-full">
                <div className="flex items-center justify-between mb-4">
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
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={handleViewProviderReviews}
                    className="text-hustlr-purple hover:underline transition-all"
                  >
                    View Reviews
                  </Button>
                </div>
                
                {user?.subscription && (
                  <div className="mb-4">
                    <Badge variant="subscription" className="mb-2">
                      {user.subscription.type} Subscriber
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Next billing: {user.subscription.nextBillingDate}
                    </p>
                  </div>
                )}
                
                <h3 className="font-semibold mb-2">Activity Summary</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-hustlr-light-purple/30 p-3 rounded-lg text-center hover:bg-hustlr-light-purple/50 transition-colors">
                    <p className="text-xl font-bold">{getUpcomingBookings(user?.id || '', 'consumer').length}</p>
                    <p className="text-sm">Upcoming</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg text-center hover:bg-green-200 transition-colors">
                    <p className="text-xl font-bold">{getCompletedBookings(user?.id || '', 'consumer').length}</p>
                    <p className="text-sm">Completed</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Time Period Filter</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={timeFilter === "week" ? "default" : "outline"} 
                      onClick={() => setTimeFilter("week")}
                    >
                      Week
                    </Button>
                    <Button 
                      size="sm" 
                      variant={timeFilter === "month" ? "default" : "outline"} 
                      onClick={() => setTimeFilter("month")}
                    >
                      Month
                    </Button>
                    <Button 
                      size="sm" 
                      variant={timeFilter === "year" ? "default" : "outline"} 
                      onClick={() => setTimeFilter("year")}
                    >
                      Year
                    </Button>
                    <Button 
                      size="sm" 
                      variant={timeFilter === "all" ? "default" : "outline"} 
                      onClick={() => setTimeFilter("all")}
                    >
                      All Time
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Bookings Section */}
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Tabs defaultValue="upcoming" onValueChange={(value) => setActiveTab(value as "upcoming" | "completed" | "canceled")}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="upcoming">
                  <Calendar className="h-4 w-4 mr-2" /> Upcoming
                </TabsTrigger>
                <TabsTrigger value="completed">
                  <ClipboardList className="h-4 w-4 mr-2" /> Completed
                </TabsTrigger>
                <TabsTrigger value="canceled">
                  <ClipboardList className="h-4 w-4 mr-2" /> Canceled
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-4">
                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <div key={booking.id} className="transform hover:scale-[1.01] transition-all duration-200 hover:shadow-md">
                        <BookingCard 
                          id={booking.id} 
                          serviceName={booking.serviceName}
                          providerName={booking.providerName}
                          date={booking.date}
                          time={booking.time}
                          status="upcoming"
                          price={booking.price}
                          onCancel={() => handleCancelBooking(booking.id)}
                        />
                      </div>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-gray-500">No upcoming bookings found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="mt-4">
                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <div key={booking.id} className="transform hover:scale-[1.01] transition-all duration-200 hover:shadow-md">
                        <BookingCard 
                          id={booking.id} 
                          serviceName={booking.serviceName}
                          providerName={booking.providerName}
                          date={booking.date}
                          time={booking.time}
                          status="completed"
                          price={booking.price}
                        />
                        <div className="mt-2 flex justify-end">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleLeaveReview(booking.id)}
                          >
                            Leave Review
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-gray-500">No completed bookings found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="canceled" className="mt-4">
                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <div key={booking.id} className="transform hover:scale-[1.01] transition-all duration-200 hover:shadow-md">
                        <BookingCard 
                          id={booking.id} 
                          serviceName={booking.serviceName}
                          providerName={booking.providerName}
                          date={booking.date}
                          time={booking.time}
                          status="canceled"
                          price={booking.price}
                        />
                      </div>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-gray-500">No canceled bookings found</p>
                      </CardContent>
                    </Card>
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
