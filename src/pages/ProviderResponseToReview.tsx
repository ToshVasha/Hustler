
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ArrowLeft, Calendar, MessageSquare, CheckCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define review type
interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  serviceId: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  providerResponse?: {
    text: string;
    date: string;
  };
}

// Mock review data
const mockReview: Review = {
  id: "r2",
  customerId: "c2",
  customerName: "Sarah T.",
  customerAvatar: "",
  serviceId: "s1",
  serviceName: "House Painting",
  rating: 4,
  comment: "Good work overall. Communication could have been better but the final result was great. I especially liked the attention to detail around the trim work and the cleanup afterwards was thorough. Would consider hiring again for future painting projects.",
  date: "2025-03-22"
};

export default function ProviderResponseToReview() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const [review] = useState<Review>(mockReview);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showTips, setShowTips] = useState(true);
  
  // Handle submitting the response
  const handleSubmitResponse = () => {
    if (!response.trim()) {
      toast({
        title: "Response Required",
        description: "Please enter a response before submitting",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Response Submitted",
        description: "Your response to the review has been published"
      });
      navigate("/provider/customer-reviews");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/provider/customer-reviews')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reviews
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Respond to Review</h1>
        
        <div className="space-y-6">
          <Card>
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
                <p className="text-sm text-gray-500 mb-2">Service: {review.serviceName}</p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Your Response
                </h3>
                <Textarea 
                  placeholder="Write your response to this review..." 
                  className="min-h-[150px]"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
                
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={submitting}
                    className="bg-hustlr-purple hover:bg-hustlr-purple/90"
                  >
                    {submitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <CheckCheck className="h-4 w-4 mr-1" /> Submit Response
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {showTips && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-blue-800 font-medium">Tips for Responding to Reviews</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-800"
                    onClick={() => setShowTips(false)}
                  >
                    Hide
                  </Button>
                </div>
                
                <ul className="text-sm text-blue-700 mt-2 space-y-2">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>Thank the customer for their feedback, even if it's negative.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>Address specific points mentioned in the review.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>Be professional and avoid defensive responses.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">4.</span>
                    <span>For negative reviews, explain what you'll do differently in the future.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">5.</span>
                    <span>Keep responses concise, around 2-3 sentences.</span>
                  </li>
                </ul>
                
                <div className="mt-4 p-3 bg-white rounded-md border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Sample Response Template:</p>
                  <p className="text-sm text-blue-700 mt-1">
                    "Thank you for your feedback, [Customer Name]. We appreciate you highlighting the [positive aspect] and we're glad you were satisfied with [mentioned positive]. Regarding [area for improvement], we're committed to improving and will [specific action]. Thank you for choosing our services!"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
