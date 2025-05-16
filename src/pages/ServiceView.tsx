
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useService } from "@/contexts/ServiceContext";
import { AppHeader } from "@/components/AppHeader";
import { ServiceDetails } from "@/components/ServiceDetails";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";

// Mock users array for provider lookups
const MOCK_USERS = [
  {
    id: "b123",
    name: "Jane Business",
    email: "business@example.com",
    type: "business" as const,
    password: "password",
    phone: "555-987-6543",
    location: "Boston",
    yearsInBusiness: 5,
    description: "Professional painting services for residential and commercial clients.",
    averageRating: 4.9,
    reviewCount: 48
  }
];

export default function ServiceView() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { services, getServiceReviews } = useService();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);

  // Helper function to find provider by ID
  const getServiceProviderById = (providerId: string) => {
    return MOCK_USERS.find(u => u.id === providerId && u.type === "business");
  };

  useEffect(() => {
    if (serviceId) {
      // Find service by ID from the services array
      const foundService = services.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
      } else {
        navigate("/services");
      }
    }
  }, [serviceId, services, navigate]);

  if (!service) {
    return (
      <div>
        <AppHeader />
        <div className="container mx-auto p-4">
          <p>Loading service details...</p>
        </div>
      </div>
    );
  }

  // Get reviews for this service
  const serviceReviews = getServiceReviews(service.id);
  
  // Format reviews for ServiceDetails component
  const formattedReviews = serviceReviews.map(review => ({
    id: Number(review.id.replace('review-', '')),
    username: review.userName,
    rating: review.rating,
    comment: review.comment,
    timeAgo: new Date(review.date).toLocaleDateString()
  }));

  // Get provider information if available
  const provider = service.providerId ? getServiceProviderById(service.providerId) : null;

  return (
    <div>
      <AppHeader />
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back to Services
            </Button>
            <Button className="bg-hustlr-purple hover:bg-hustlr-purple/90 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Book Now
            </Button>
            {provider && (
              <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/messages')}>
                <MessageSquare className="h-4 w-4" />
                Contact Provider
              </Button>
            )}
          </div>
          
          {/* Service details */}
          <ServiceDetails 
            name={service.name}
            description={service.description}
            experience={`${service.rating}/5 based on ${service.reviewCount} reviews`}
            topProviders={service.rating >= 4.8 ? "Service Provider" : undefined}
            portfolioImages={[service.imageUrl]}
            reviewCount={service.reviewCount}
            reviews={formattedReviews}
          />
        </div>
      </div>
    </div>
  );
}
