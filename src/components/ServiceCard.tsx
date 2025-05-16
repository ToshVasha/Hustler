
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ServiceCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  experience?: string;
  customerSatisfaction?: string;
  onBook?: (id: string) => void;
  description?: string;
  image?: string; // Optional image URL
}

export function ServiceCard({ 
  id, 
  name, 
  price, 
  rating, 
  experience, 
  customerSatisfaction,
  onBook,
  description,
  image
}: ServiceCardProps) {
  const navigate = useNavigate();

  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/consumer/book/${id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/consumer/service-details/${id}`);
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{name}</h3>
          <Badge variant="outline" className="bg-gray-100">
            ${price}/hr
          </Badge>
        </div>
        
        {description && (
          <p className="text-gray-600 mt-2 text-sm line-clamp-2">{description}</p>
        )}
        
        <div className="mt-3 flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">{rating}</span>
        </div>
        
        <div className="mt-4 space-y-1">
          {experience && (
            <p className="text-sm text-gray-700">{experience}</p>
          )}
          
          {customerSatisfaction && (
            <p className="text-sm text-gray-700">{customerSatisfaction}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          
          <Button 
            size="sm"
            onClick={handleBook}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
