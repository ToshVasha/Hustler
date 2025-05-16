
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  limitedTime?: boolean;
  billingCycle: "weekly" | "monthly";
  nextBillingDate?: string;
}

interface SubscriptionPlansProps {
  userType: "consumer" | "business";
  onSubscribe?: (planId: string) => void;
}

export function SubscriptionPlans({ userType, onSubscribe }: SubscriptionPlansProps) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get next billing date (7 days from today)
  const getNextBillingDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString();
  };

  const consumerPlans: Plan[] = [
    {
      id: "consumer-free",
      name: "Free",
      price: 0,
      features: [
        "Access to basic service providers",
        "3 messages per month",
        "Limited search filters"
      ],
      billingCycle: "weekly"
    },
    {
      id: "consumer-basic",
      name: "Basic Weekly",
      price: 1.99,
      features: [
        "Access to all service providers",
        "Unlimited messaging",
        "All search filters",
        "Save favorite providers"
      ],
      recommended: true,
      billingCycle: "weekly",
      nextBillingDate: getNextBillingDate()
    },
    {
      id: "consumer-premium",
      name: "Pro Weekly",
      price: 3.99,
      features: [
        "All Basic features",
        "Priority booking",
        "Exclusive discounts",
        "24/7 customer support",
        "Cancel anytime"
      ],
      limitedTime: true,
      billingCycle: "weekly",
      nextBillingDate: getNextBillingDate()
    }
  ];

  const businessPlans: Plan[] = [
    {
      id: "business-free",
      name: "Free",
      price: 0,
      features: [
        "List 1 service",
        "Basic provider profile",
        "5 messages per month"
      ],
      billingCycle: "weekly"
    },
    {
      id: "business-pro",
      name: "Pro Weekly",
      price: 4.99,
      features: [
        "List up to 10 services",
        "Enhanced provider profile",
        "Unlimited messaging",
        "Access to business analytics",
        "Higher search ranking"
      ],
      recommended: true,
      billingCycle: "weekly",
      nextBillingDate: getNextBillingDate()
    },
    {
      id: "business-premium",
      name: "Weekly Plus",
      price: 9.99,
      features: [
        "All Pro features",
        "Unlimited services",
        "Featured in recommendations",
        "Priority customer support",
        "Booking management tools",
        "Custom branding options"
      ],
      limitedTime: true,
      billingCycle: "weekly",
      nextBillingDate: getNextBillingDate()
    }
  ];

  const plans = userType === "consumer" ? consumerPlans : businessPlans;

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Successfully subscribed to ${plans.find(p => p.id === planId)?.name} plan! Next billing date: ${getNextBillingDate()}`);
      if (onSubscribe) {
        onSubscribe(planId);
      }
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Choose Your Weekly Subscription</h2>
        <p className="text-gray-600">
          {userType === "consumer" 
            ? "Get access to premium features and connect with top-rated service providers. Billed weekly."
            : "Grow your business with our premium tools and reach more customers. Billed every 7 days."
          }
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative overflow-hidden ${plan.recommended ? 'border-hustlr-purple shadow-lg' : ''}`}>
            {plan.recommended && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-bl rounded-tr-none bg-hustlr-purple">Recommended</Badge>
              </div>
            )}
            
            {plan.limitedTime && (
              <div className="absolute top-0 left-0">
                <Badge variant="outline" className="rounded-br rounded-tl-none border-orange-400 text-orange-500">Limited Time</Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="flex items-end gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/week</span>
              </CardDescription>
              {plan.price > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Billed weekly. Next billing: {plan.nextBillingDate}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.recommended ? 'bg-hustlr-purple hover:bg-hustlr-purple/90' : ''}`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading && selectedPlan === plan.id}
              >
                {isLoading && selectedPlan === plan.id ? (
                  "Processing..."
                ) : plan.price === 0 ? (
                  <span className="flex items-center">
                    Start Free <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Subscribe Weekly <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>All paid plans include a 7-day free trial. Cancel anytime before your next weekly billing date.</p>
        <p className="mt-2">By subscribing, you agree to our weekly billing cycle. Your subscription will automatically renew every 7 days.</p>
      </div>
    </div>
  );
}
