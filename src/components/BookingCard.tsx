
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface BookingCardProps {
  id: string;
  serviceName?: string;
  service?: string;
  providerName?: string;
  business?: string;
  price: number;
  date: string;
  time: string;
  status?: "upcoming" | "completed" | "canceled";
  dateTime?: string; // Optional dateTime prop for backward compatibility
  onCancel?: () => void; // Optional onCancel callback
}

export function BookingCard({
  id,
  service,
  serviceName,
  business,
  providerName,
  price,
  date,
  time,
  status = "upcoming",
  dateTime, // New prop
  onCancel, // New prop
}: BookingCardProps) {
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-gray-100 text-gray-800",
  };

  // Use either service or serviceName, prioritizing serviceName if both exist
  const displayService = serviceName || service || "";
  // Use either business or providerName, prioritizing providerName if both exist
  const displayProvider = providerName || business || "";

  // Extract date and time from dateTime if provided and date/time not provided
  const displayDate = date || (dateTime ? dateTime.split(' ')[0] : "");
  const displayTime = time || (dateTime ? dateTime.split(' ')[1] : "");

  return (
    <Card className="w-full mb-4 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-lg">{displayService}</h3>
              {status && (
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${statusColors[status]}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              )}
            </div>
            {displayProvider && <p className="text-gray-600 text-sm">{displayProvider}</p>}
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-medium">Booked on:</span> {displayDate}
              </p>
              <p className="text-sm">
                <span className="font-medium">Time:</span> {displayTime}
              </p>
            </div>
          </div>
          <div className="md:text-right mt-3 md:mt-0">
            <p className="font-medium">Paying: ${price.toFixed(2)}</p>
            <div className="mt-2 flex gap-2 justify-end">
              <Link to={`/consumer/messages/${id}`}>
                <Button variant="outline" size="sm" className="message-icon">
                  <MessageSquare size={16} className="mr-2" />
                  Message
                </Button>
              </Link>
              {status === "completed" && (
                <Link to={`/consumer/review/${id}`}>
                  <Button size="sm" variant="default">
                    Leave Review
                  </Button>
                </Link>
              )}
              {onCancel && status === "upcoming" && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
