
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProviderReviewPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { bookings } = useBooking();
  const { user } = useAuth();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (bookingId && bookings) {
      const foundBooking = bookings.find(b => b.id === bookingId);
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        toast({
          title: "Error",
          description: "Booking not found",
          variant: "destructive"
        });
        navigate(-1);
      }
    }
  }, [bookingId, bookings, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a review title",
        variant: "destructive"
      });
      return;
    }

    if (!user || !booking) {
      toast({
        title: "Error",
        description: "Unable to submit review",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would submit to an API endpoint
    console.log({
      bookingId,
      consumerId: booking.consumerId,
      providerId: user.id,
      rating,
      title,
      description,
      reviewDate: new Date().toISOString(),
    });

    toast({
      title: "Success",
      description: "Review of consumer submitted successfully!",
      variant: "default"
    });
    navigate("/provider/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Review the Customer</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {booking && (
                <div className="mb-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium">{booking.serviceName}</h3>
                  <p className="text-sm text-muted-foreground">Customer: {booking.consumerName}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {booking.date} at {booking.time}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {rating > 0 ? `${rating} out of 5 stars` : "Select rating"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Review Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience with this customer"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Review Description</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share details about your experience with this customer"
                  rows={4}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
