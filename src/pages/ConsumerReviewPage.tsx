
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useBooking } from "@/contexts/BookingContext";
import { useService } from "@/contexts/ServiceContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ConsumerReviewPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { bookings } = useBooking();
  const { addReview } = useService();
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
        toast.error("Booking not found");
        navigate(-1);
      }
    }
  }, [bookingId, bookings, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    if (!title.trim()) {
      toast.error("Please provide a review title");
      return;
    }

    if (!user || !booking) {
      toast.error("Unable to submit review");
      return;
    }

    // Add the review to the service
    addReview({
      serviceId: booking.serviceId,
      userId: user.id,
      userName: user.name,
      rating,
      comment: description,
    });

    toast.success("Review submitted successfully!");
    navigate("/consumer/dashboard");
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Rate Your Experience</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {booking && (
                <div className="mb-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium">{booking.serviceName}</h3>
                  <p className="text-sm text-muted-foreground">Provider: {booking.providerName}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {booking.date} at {booking.time}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Rating</label>
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
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Review Description</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share the details of your experience"
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
