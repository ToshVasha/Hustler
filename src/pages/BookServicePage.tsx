
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { useService } from "@/contexts/ServiceContext";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/DateTimePicker";
import { format } from "date-fns";

export default function BookServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { services } = useService();
  const { createBooking } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
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

  const handleBookingSubmit = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to book a service");
      return;
    }
    
    try {
      // Format date for booking
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      // Create the booking
      createBooking({
        serviceId: service.id,
        serviceName: service.name,
        providerId: service.providerId,
        providerName: "Provider Name", // In a real app, you'd get this from the provider details
        consumerId: user.id,
        consumerName: user.name,
        price: service.price,
        date: formattedDate,
        time: selectedTime,
        status: "upcoming"
      });
      
      // Navigate to dashboard after booking
      navigate("/consumer/dashboard");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-hustlr-light-gray">
        <AppHeader />
        <div className="container mx-auto p-4 text-center">
          Loading service details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      <div className="container mx-auto p-4 max-w-3xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Book Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-2">{service.name}</h2>
              <p className="text-gray-600">{service.description}</p>
              <div className="mt-4 flex items-center">
                <span className="font-semibold">Price:</span>
                <span className="ml-2">${service.price}/hr</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Select Date and Time</h3>
              <DateTimePicker 
                date={selectedDate}
                setDate={setSelectedDate}
                time={selectedTime}
                setTime={setSelectedTime}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleBookingSubmit}>
              Confirm Booking
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
