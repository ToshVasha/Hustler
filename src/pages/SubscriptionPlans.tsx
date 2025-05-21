
import { AppHeader } from "@/components/AppHeader";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionPlansPage() {
  const { userType, user } = useAuth();
  const navigate = useNavigate();
  
  // Assume the user object might have a subscription status
  const hasActiveSubscription = user?.subscription?.active;
  const nextBillingDate = user?.subscription?.nextBillingDate;

  const handleSubscribe = (planId: string) => {
    // In a real app, this would handle the subscription process
    // For now, just navigate back based on user type
    setTimeout(() => {
      if (userType === "business") {
        navigate("/business");
      } else {
        navigate("/");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        {hasActiveSubscription && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold">Current Subscription</h2>
                  <Badge variant="subscription">Active</Badge>
                </div>
                <p className="text-gray-600">
                  You are currently subscribed to our weekly plan. 
                  {nextBillingDate && <span> Next billing date: <strong>{nextBillingDate}</strong></span>}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => {
                  // In a real app, this would cancel the subscription
                  alert("This would cancel your subscription in a real app");
                }}
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        )}
        
        <SubscriptionPlans 
          userType={userType === "business" ? "business" : "consumer"} 
          onSubscribe={handleSubscribe}
        />
      </div>
    </div>
  );
}
