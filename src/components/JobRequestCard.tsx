
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface JobRequestProps {
  jobType: string;
  businessPrice: number;
  customerOffer: number;
  dates: string;
  times: string;
  comments: string;
  image?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function JobRequestCard({
  jobType,
  businessPrice,
  customerOffer,
  dates,
  times,
  comments,
  image,
  onAccept,
  onDecline
}: JobRequestProps) {
  return (
    <Card className="w-full overflow-hidden card-shadow animate-fade-in">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {image && (
            <div className="w-full md:w-1/3">
              <img
                src={image}
                alt={jobType}
                className="h-full w-full object-cover"
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}
          <div className={`w-full ${image ? 'md:w-2/3' : 'w-full'} p-4`}>
            <h3 className="text-lg font-semibold">{jobType}</h3>
            
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Your Price:</span>
                <span className="font-medium">${businessPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Customer Offer:</span>
                <span className="font-medium">${customerOffer.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Availability:</span>
                <span>{dates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Time:</span>
                <span>{times}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <h4 className="text-sm font-medium">Customer comments:</h4>
              <p className="text-sm mt-1 text-gray-600">{comments}</p>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                onClick={onDecline}
                variant="outline"
                className="border-gray-300"
              >
                Decline
              </Button>
              <Button onClick={onAccept}>Accept</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
