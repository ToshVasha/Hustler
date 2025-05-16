
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar, MessageSquare, MapPin, DollarSign, User, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMessage } from "@/contexts/MessageContext";
import { useBooking } from "@/contexts/BookingContext";

// Mock jobs data (same as in ProviderJobsPage)
const MOCK_JOBS = [
  {
    id: "job1",
    title: "Kitchen Repainting",
    category: "painting",
    description: "Need professional painter to repaint kitchen cabinets and walls. White color, approximately 200 sq ft.",
    budget: { min: 200, max: 300 },
    location: "San Francisco, CA",
    postedDate: "2025-05-09T10:30:00",
    consumerName: "Sandra East",
    consumerId: "c456",
    status: "open",
    type: "one-time",
    detailedDescription: `I'm looking for an experienced painter to repaint my kitchen cabinets and walls. The cabinets are currently dark brown and I'd like them painted white. There are 15 cabinet doors and 5 drawer fronts.

The kitchen walls are approximately 200 square feet and need to be painted in a light gray color. I'll provide the paint for the walls, but would like the contractor to provide high-quality cabinet paint.

This job requires:
- Proper preparation (sanding, priming)
- Two coats of paint
- Clean lines and professional finish
- Completion within 2-3 days

I'm flexible on timing and can work around your schedule in the next two weeks.`,
    timeline: "Within 2 weeks",
    availability: "Weekdays 9AM-5PM"
  },
  {
    id: "job2",
    title: "Weekly House Cleaning",
    category: "cleaning",
    description: "Looking for a regular house cleaner for a 2000 sq ft home. Weekly service needed.",
    budget: { min: 80, max: 120 },
    location: "Oakland, CA",
    postedDate: "2025-05-10T14:15:00",
    consumerName: "Michael West",
    consumerId: "c457",
    status: "open",
    type: "recurring",
    detailedDescription: `I need weekly cleaning services for my 2000 sq ft home in Oakland. The house has 3 bedrooms, 2 bathrooms, a kitchen, living room, and dining area.

Services needed include:
- Vacuuming and mopping all floors
- Dusting surfaces
- Cleaning bathrooms (toilets, showers, sinks)
- Kitchen cleaning (countertops, appliance exteriors, sink)
- Changing bed linens (linens will be provided)

Looking for someone who can come once a week, preferably on Fridays or Saturdays. I have two cats, so pet-friendly cleaners only please.`,
    timeline: "Starting next week",
    availability: "Fridays or Saturdays, between 10AM-3PM"
  },
  // ... other jobs
];

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { startNewConversation } = useMessage();
  const { createBooking } = useBooking();
  
  const [job, setJob] = useState<any>(null);
  const [quote, setQuote] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    // Fetch job details based on ID
    if (jobId) {
      const foundJob = MOCK_JOBS.find(j => j.id === jobId);
      if (foundJob) {
        setJob(foundJob);
      } else {
        navigate("/provider/jobs");
      }
    }
  }, [jobId, navigate]);
  
  // Redirect if not a provider
  useEffect(() => {
    if (userType !== 'business') {
      navigate("/");
    }
  }, [userType, navigate]);
  
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quote) {
      toast({
        title: "Error",
        description: "Please enter your price quote",
        variant: "destructive"
      });
      return;
    }
    
    if (!message) {
      toast({
        title: "Error",
        description: "Please enter a message to the customer",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create a booking record for this job application
      if (job && user) {
        // Start a conversation with the customer
        startNewConversation(
          [job.consumerId, user.id],
          message,
          undefined // No booking yet
        );
        
        // Create a booking record for this job (as pending)
        createBooking({
          serviceId: job.id,
          serviceName: job.title,
          providerId: user.id,
          providerName: user.name, // Use name property which exists on both business and consumer users
          consumerId: job.consumerId,
          consumerName: job.consumerName,
          price: parseFloat(quote),
          date: new Date().toISOString().split('T')[0], // Today's date
          time: "To be decided",
          status: "pending",
          notes: message,
          location: job.location
        });
        
        toast({
          title: "Application submitted",
          description: "Your application has been sent to the customer",
        });
        
        navigate("/provider/jobs");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Posted just now';
    } else if (diffInHours < 24) {
      return `Posted ${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Posted ${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };
  
  if (!job) {
    return (
      <div>
        <AppHeader />
        <div className="container mx-auto p-4">
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <AppHeader />
      <div className="container mx-auto p-4 max-w-5xl py-8">
        <Button variant="outline" className="mb-6" onClick={() => navigate("/provider/jobs")}>
          Back to Jobs
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <Badge variant={job.type === "recurring" ? "outline" : "secondary"}>
                    {job.type === "recurring" ? "Recurring" : "One-time"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {getRelativeTime(job.postedDate)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Job Details</h3>
                  <div className="whitespace-pre-line">
                    {job.detailedDescription || job.description}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Budget</div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="font-medium">${job.budget.min} - ${job.budget.max}</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Timeline</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="font-medium">{job.timeline}</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Customer Availability</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="font-medium">{job.availability}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">Posted By</h3>
                  <div className="flex items-center mt-2">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{job.consumerName}</div>
                      <div className="text-sm text-gray-500">{job.location}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
                <CardDescription>
                  Submit your price quote and message to the customer
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Price Quote ($)
                    </label>
                    <Input
                      id="quote"
                      placeholder="Enter your quote"
                      type="number"
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      min={1}
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Customer budget: ${job.budget.min} - ${job.budget.max}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message to Customer
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Introduce yourself and explain why you're a good fit for this job..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  className="w-full bg-hustlr-purple hover:bg-hustlr-purple/90" 
                  onClick={handleApply}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Apply Now"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/provider/jobs")}
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
