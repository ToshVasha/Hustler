
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ServiceDetails } from "@/components/ServiceDetails";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";
import { useService } from "@/contexts/ServiceContext";
import { toast } from "sonner";

export default function ConsumerServiceDetails() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { services, getServiceReviews } = useService();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (serviceId) {
      const foundService = services.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
      } else {
        toast.error("Service not found");
        navigate("/consumer/services");
      }
    }
  }, [serviceId, services, navigate]);

  const handleBookNow = () => {
    navigate(`/consumer/book/${serviceId}`);
  };

  const handleContactProvider = () => {
    // In a real app, we would navigate to a specific conversation with this provider
    navigate("/consumer/messages");
    toast.info("Navigated to messages");
  };

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
            <Button 
              className="bg-hustlr-purple hover:bg-hustlr-purple/90 flex items-center gap-2"
              onClick={handleBookNow}
            >
              <Calendar className="h-4 w-4" />
              Book Now
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={handleContactProvider}
            >
              <MessageSquare className="h-4 w-4" />
              Contact Provider
            </Button>
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
