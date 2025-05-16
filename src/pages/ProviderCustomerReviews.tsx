
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, Search, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Define types for reviews
interface CustomerReview {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  serviceId: string;
  serviceName: string;
  bookingId: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "hidden";
  providerResponse?: {
    text: string;
    date: string;
  };
}

// Mock reviews data
const mockReviews: CustomerReview[] = [
  {
    id: "r1",
    customerId: "c1",
    customerName: "Michael B.",
    customerAvatar: "",
    serviceId: "s1",
    serviceName: "House Painting",
    bookingId: "b1",
    rating: 5,
    comment: "Excellent service, very professional and completed the job ahead of schedule.",
    date: "2025-04-15",
    status: "published"
  },
  {
    id: "r2",
    customerId: "c2",
    customerName: "Sarah T.",
    customerAvatar: "",
    serviceId: "s1",
    serviceName: "House Painting",
    bookingId: "b2",
    rating: 4,
    comment: "Good work overall. Communication could have been better but the final result was great.",
    date: "2025-03-22",
    status: "published",
    providerResponse: {
      text: "Thank you for your feedback, Sarah! We're working on improving our communication processes.",
      date: "2025-03-23"
    }
  },
  {
    id: "r3",
    customerId: "c3",
    customerName: "Robert J.",
    customerAvatar: "",
    serviceId: "s2",
    serviceName: "Kitchen Renovation",
    bookingId: "b3",
    rating: 5,
    comment: "Fantastic attention to detail. Would definitely hire again for future projects.",
    date: "2025-05-01",
    status: "published"
  }
];

// Sorting and filtering types
type SortOption = "recent" | "highest" | "lowest";
type FilterOption = "all" | "responded" | "not-responded" | "five-star" | "critical";

export default function ProviderCustomerReviews() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Functions to handle filtering and sorting
  const getFilteredReviews = () => {
    let results = [...mockReviews];
    
    // Filter by search
    if (searchQuery) {
      results = results.filter(review => 
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by tab/service
    if (activeTab !== "all") {
      results = results.filter(review => review.serviceId === activeTab);
    }
    
    // Apply additional filters
    switch (filterOption) {
      case "responded":
        results = results.filter(review => review.providerResponse);
        break;
      case "not-responded":
        results = results.filter(review => !review.providerResponse);
        break;
      case "five-star":
        results = results.filter(review => review.rating === 5);
        break;
      case "critical":
        results = results.filter(review => review.rating <= 3);
        break;
      default:
        break;
    }
    
    // Sort reviews
    switch (sortOption) {
      case "recent":
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "highest":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        results.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    
    return results;
  };

  const filteredReviews = getFilteredReviews();
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (mockReviews.length === 0) return 0;
    const total = mockReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / mockReviews.length).toFixed(1);
  };
  
  const averageRating = calculateAverageRating();

  // Handle responding to a review
  const handleRespond = (reviewId: string) => {
    navigate(`/provider/respond-to-review/${reviewId}`);
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/provider/profile')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Reviews</h1>
          <div className="flex items-center mt-2 md:mt-0">
            <div className="flex items-center mr-4">
              <div className="flex mr-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-5 w-5 ${star <= Number(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <span className="font-bold">{averageRating}</span>
            </div>
            <p className="text-gray-600">({mockReviews.length} reviews)</p>
          </div>
        </div>
        
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search reviews..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterOption} onValueChange={(value) => setFilterOption(value as FilterOption)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reviews</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="not-responded">Not Responded</SelectItem>
                    <SelectItem value="five-star">5 Star</SelectItem>
                    <SelectItem value="critical">Critical (≤ 3★)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all">All Services</TabsTrigger>
                <TabsTrigger value="s1">House Painting</TabsTrigger>
                <TabsTrigger value="s2">Renovation</TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>
        </div>
        
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <Card key={review.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={review.customerAvatar} alt={review.customerName} />
                        <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.customerName}</p>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Service: {review.serviceName}</p>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                  
                  {review.providerResponse ? (
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <p className="font-medium text-sm">Your Response</p>
                      <p className="text-gray-700 text-sm mt-1">{review.providerResponse.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Responded on {new Date(review.providerResponse.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRespond(review.id)}
                      >
                        Respond to Review
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No reviews found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
