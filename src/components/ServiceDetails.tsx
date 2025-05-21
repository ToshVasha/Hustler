
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface ReviewProps {
  id: number;
  username: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

export interface ServiceDetailsProps {
  name: string;
  description: string;
  experience: string;
  topProviders?: string;
  portfolioImages: string[];
  reviewCount?: number;
  reviews: ReviewProps[];
}

export function ServiceDetails({
  name,
  description,
  experience,
  topProviders,
  portfolioImages,
  reviewCount,
  reviews
}: ServiceDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold mb-2">{name}</h2>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                      key={star}
                      size={18}
                      className="text-yellow-500 fill-yellow-500 mr-1"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm">{experience}</span>
                {topProviders && (
                  <span className="ml-4 text-sm text-hustlr-purple">Top {topProviders}</span>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed">{description}</p>
              <div className="mt-4">
                <Badge variant="subscription" className="mr-2">Weekly Subscription</Badge>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Services Offered</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 text-hustlr-purple">✓</span>
                    Interior Painting
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-hustlr-purple">✓</span>
                    Exterior Painting
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-hustlr-purple">✓</span>
                    Wallpaper Removal
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-hustlr-purple">✓</span>
                    Drywall Repair
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioImages.map((image, index) => (
              <div key={index} className="aspect-video rounded-md overflow-hidden bg-gray-100">
                <img 
                  src={image} 
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Customer Reviews</h3>
            <span className="text-sm text-gray-500">{reviews.length} reviews</span>
          </div>
          
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{review.username}</h4>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon 
                          key={star}
                          size={14}
                          className={`${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} mr-1`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.timeAgo}</span>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
