
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppHeader } from "@/components/AppHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { BookingCard } from "@/components/BookingCard";
import { MapView } from "@/components/MapView";
import { Search, MapPin, List } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Mock data
const services = [
  { 
    id: "s1", 
    name: "John's Paintin'", 
    price: 110, 
    rating: 5, 
    experience: "10 years experience", 
    customerSatisfaction: "Top 5% customer satisfaction",
    lat: 40.712, 
    lng: -74.006 
  },
  { 
    id: "s2", 
    name: "Just Jenny's Paints", 
    price: 115, 
    rating: 5, 
    experience: "5 years experience", 
    customerSatisfaction: "Top 5% customer satisfaction",
    lat: 40.718, 
    lng: -73.990 
  },
  { 
    id: "s3", 
    name: "Corey Coats", 
    price: 90, 
    rating: 5, 
    experience: "3 year experience", 
    customerSatisfaction: "",
    lat: 40.722, 
    lng: -74.015 
  }
];

const upcomingBookings = [
  { 
    id: "b1", 
    service: "Dog Grooming", 
    business: "Dan's Dirty Dogs", 
    price: 45, 
    date: "12/04/2025", 
    time: "09:30" 
  }
];

// Types
type ViewMode = "map" | "list";

export default function Index() {
  const { user, isAuthenticated, userType } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const navigate = useNavigate();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-hustlr-light-gray p-4">
        <div className="max-w-md text-center mb-6">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-hustlr-purple flex items-center justify-center">
            <span className="text-3xl font-bold text-white">H</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Hustlr</h1>
          <p className="text-gray-600 mb-6">The marketplace connecting consumers with the perfect service providers</p>
          <Button onClick={() => navigate("/login")}>Log in to continue</Button>
        </div>
        
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-semibold mb-4">Demo Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded-md">
              <h3 className="font-medium">Consumer View</h3>
              <p className="text-sm text-gray-500 mb-2">Login as a service consumer</p>
              <p className="text-xs mb-1"><span className="font-medium">Email:</span> consumer@example.com</p>
              <p className="text-xs mb-3"><span className="font-medium">Password:</span> any password will work</p>
            </div>
            <div className="border p-4 rounded-md">
              <h3 className="font-medium">Business View</h3>
              <p className="text-sm text-gray-500 mb-2">Login as a service provider</p>
              <p className="text-xs mb-1"><span className="font-medium">Email:</span> business@example.com</p>
              <p className="text-xs mb-3"><span className="font-medium">Password:</span> any password will work</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If logged in as business, redirect to business page
  if (userType === 'business') {
    navigate("/business");
    return null;
  }

  const handleBookService = (serviceId: string) => {
    toast.success("Service booked successfully!");
    navigate(`/service/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 gap-6">
          {/* Search Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Find Services</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="What service do you need?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Price</SelectItem>
                    <SelectItem value="low">Low to High</SelectItem>
                    <SelectItem value="high">High to Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="nearby">Nearby</SelectItem>
                    <SelectItem value="5km">Within 5km</SelectItem>
                    <SelectItem value="10km">Within 10km</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Rating</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mb-4">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  onClick={() => setViewMode("map")}
                  className={`rounded-none ${viewMode === "map" ? "" : "border-0"}`}
                  size="sm"
                >
                  <MapPin size={16} className="mr-1" />
                  Map
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  className={`rounded-none ${viewMode === "list" ? "" : "border-0"}`}
                  size="sm"
                >
                  <List size={16} className="mr-1" />
                  List
                </Button>
              </div>
            </div>
            
            {viewMode === "map" && (
              <div className="mb-6">
                <MapView 
                  markers={services.map(s => ({ 
                    id: s.id, 
                    lat: s.lat, 
                    lng: s.lng, 
                    name: s.name, 
                    price: s.price 
                  }))} 
                  onMarkerClick={(markerId) => {
                    // In a real app, we could highlight the service in the list
                    console.log(`Selected marker: ${markerId}`);
                  }} 
                />
              </div>
            )}
            
            <div className="space-y-2">
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  price={service.price}
                  rating={service.rating}
                  experience={service.experience}
                  customerSatisfaction={service.customerSatisfaction}
                  onBook={handleBookService}
                />
              ))}
              
              <div className="text-center mt-4">
                <Button variant="outline">See More</Button>
              </div>
            </div>
          </div>
          
          {/* Upcoming Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
              <Button variant="link" className="text-hustlr-purple p-0">
                See past bookings
              </Button>
            </div>
            
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    id={booking.id}
                    service={booking.service}
                    business={booking.business}
                    price={booking.price}
                    date={booking.date}
                    time={booking.time}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No upcoming bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
