
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for reviews
const mockReviews = [
  {
    id: "r1",
    providerId: "p1",
    providerName: "John's Painting",
    providerAvatar: "",
    rating: 5,
    comment: "Jessica was an excellent client! Very responsive and clear with her requirements. The space was clean and well-prepared for our work. Would definitely work with her again!",
    date: "2025-04-15",
    bookingId: "b1",
    serviceType: "Wall Painting"
  },
  {
    id: "r2",
    providerId: "p2",
    providerName: "Elite Plumbing",
    providerAvatar: "",
    rating: 4,
    comment: "Great customer who was patient during the repair process. Left the workspace tidy and was prompt with payment.",
    date: "2025-03-22",
    bookingId: "b2",
    serviceType: "Pipe Repair"
  },
  {
    id: "r3",
    providerId: "p3",
    providerName: "Green Thumb Landscaping",
    providerAvatar: "",
    rating: 5,
    comment: "Fantastic to work with! Clear communication and reasonable expectations. Looking forward to future projects together.",
    date: "2025-02-10",
    bookingId: "b3",
    serviceType: "Garden Design"
  },
];

type FilterType = "all" | "highest" | "lowest" | "recent";

export default function ConsumerProviderReviews() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Filter reviews based on search and selected filter
  const getFilteredReviews = () => {
    let filteredReviews = [...mockReviews];
    
    if (searchQuery) {
      filteredReviews = filteredReviews.filter(review => 
        review.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch(filter) {
      case "highest":
        return filteredReviews.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return filteredReviews.sort((a, b) => a.rating - b.rating);
      case "recent":
        return filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      default:
        return filteredReviews;
    }
  };

  const reviews = getFilteredReviews();

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Provider Reviews About You</h1>
          <Button variant="outline" onClick={() => history.back()}>
            Back
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Rating</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-hustlr-purple">{user?.averageRating || 4.0}</span>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`h-5 w-5 ${star <= (user?.averageRating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600">Based on {user?.reviewCount || mockReviews.length} reviews from providers you've worked with. Maintaining a high rating helps you get priority for booking requests and access to premium services.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Reviews
            </Button>
            <Button
              variant={filter === "highest" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("highest")}
            >
              Highest Rated
            </Button>
            <Button
              variant={filter === "lowest" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("lowest")}
            >
              Lowest Rated
            </Button>
            <Button
              variant={filter === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("recent")}
            >
              Most Recent
            </Button>
          </div>
          <div className="w-64">
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.providerAvatar} alt={review.providerName} />
                      <AvatarFallback>{review.providerName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg">{review.providerName}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          for {review.serviceType}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">No reviews found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
