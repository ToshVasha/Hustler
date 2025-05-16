
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Calendar, MapPin, Phone, Mail, Clock, Plus, Image, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Enhanced TypeScript interfaces
export interface BusinessHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
  holidays: { name: string; date: string; isOpen: boolean; open?: string; close?: string }[];
}

export interface ProviderContact {
  phone: string;
  email: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface ProviderCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialID: string;
  credentialURL?: string;
  verified: boolean;
}

export interface ProviderInsurance {
  id: string;
  type: string;
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  verified: boolean;
}

export interface ProviderEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface ProviderAward {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface ProviderSubscription {
  id: string;
  planId: string;
  planName: string;
  planLevel: 'free' | 'basic' | 'premium' | 'enterprise';
  price: number;
  billingCycle: 'weekly' | 'monthly' | 'annually';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  status: 'active' | 'past_due' | 'canceled' | 'expired';
  features: {
    name: string;
    included: boolean;
    limit?: number;
    used?: number;
  }[];
  paymentMethod: {
    type: 'credit_card' | 'bank_account' | 'paypal';
    last4?: string;
    expMonth?: number;
    expYear?: number;
    brand?: string;
  };
  nextBillingDate: string;
  cancellationDate?: string;
}

export interface ProviderAnalytics {
  profileViews: number;
  profileClicks: number;
  contactRequests: number;
  quoteSent: number;
  bookingConversionRate: number;
  responseRate: number;
  responseTime: number;
  completionRate: number;
  cancelationRate: number;
  averageRating: number;
  reviewCount: number;
  repeatClientRate: number;
  totalRevenue: number;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
}

export interface ProviderPaymentInfo {
  accountId: string;
  accountType: 'individual' | 'business';
  accountStatus: 'pending' | 'active' | 'suspended' | 'closed';
  defaultPayoutMethod: 'bank_account' | 'paypal' | 'check';
  bankAccounts: {
    id: string;
    bankName: string;
    accountType: 'checking' | 'savings';
    last4: string;
    routingNumber: string;
    isDefault: boolean;
    status: 'verified' | 'pending' | 'failed';
  }[];
  paymentMethods: {
    id: string;
    type: 'credit_card' | 'bank_account' | 'paypal';
    isDefault: boolean;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    brand?: string;
  }[];
  taxInformation: {
    taxId: string;
    taxIdType: 'ssn' | 'ein';
    businessName?: string;
    taxClassification: string;
    w9Submitted: boolean;
    submitDate?: string;
  };
}

export interface ServiceImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  level: number;
  iconName?: string;
}

export interface ServiceLocation {
  id: string;
  name: string;
  zipCodes: string[];
  cities: string[];
  states: string[];
  radius?: number;
  centerPoint?: {
    latitude: number;
    longitude: number;
  };
}

export interface ServiceReviews {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  response?: {
    comment: string;
    date: string;
  };
  helpful: number;
  serviceId: string;
  serviceName: string;
}

export interface ProviderService {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  bookingCount: number;
  images: ServiceImage[];
  locations: ServiceLocation[];
  reviews: ServiceReviews[];
  features: string[];
  tags: string[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export interface BusinessUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'business';
  avatar?: string;
  location: string;
  description: string;
  yearsInBusiness: number;
  employeeCount: number;
  businessType: string;
  licenseNumber?: string;
  taxId?: string;
  website?: string;
  averageRating: number;
  reviewCount: number;
  subscription?: ProviderSubscription;
  businessHours: BusinessHours;
  contact: ProviderContact;
  certifications: ProviderCertification[];
  insurance: ProviderInsurance[];
  education: ProviderEducation[];
  awards: ProviderAward[];
  analytics: ProviderAnalytics;
  paymentInfo: ProviderPaymentInfo;
  services: ProviderService[];
  portfolioGallery: string[];
}

interface ServiceProps {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
}

// Mock services for the provider
const mockServices: ServiceProps[] = [
  {
    id: "s1",
    name: "House Painting",
    category: "Home Improvement",
    price: 50,
    rating: 4.8,
    reviewCount: 24,
    description: "Professional interior and exterior painting services with premium materials.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "s2",
    name: "Kitchen Renovation",
    category: "Home Improvement",
    price: 120,
    rating: 4.6,
    reviewCount: 18,
    description: "Complete kitchen redesign and installation services.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "s3",
    name: "Bathroom Remodeling",
    category: "Home Improvement",
    price: 90,
    rating: 4.7,
    reviewCount: 15,
    description: "Modern bathroom remodeling with quality fixtures and finishes.",
    imageUrl: "/placeholder.svg"
  }
];

// Mock reviews
const mockReviews = [
  {
    id: "r1",
    user: "Michael B.",
    rating: 5,
    date: "2023-04-15",
    comment: "Excellent service, very professional and completed the job ahead of schedule.",
    serviceId: "s1"
  },
  {
    id: "r2",
    user: "Sarah T.",
    rating: 4,
    date: "2023-03-22",
    comment: "Good work overall. Communication could have been better but the final result was great.",
    serviceId: "s1"
  },
  {
    id: "r3",
    user: "Robert J.",
    rating: 5,
    date: "2023-05-01",
    comment: "Fantastic attention to detail. Would definitely hire again for future projects.",
    serviceId: "s2"
  }
];

export default function ProviderProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("services");
  
  // Type guard to check if user is a business user
  const isBusinessUser = user?.type === "business";
  
  // Subscription information
  const subscription = user?.subscription;
  
  // Function to handle viewing service details
  const handleViewServiceDetails = (serviceId: string) => {
    navigate(`/provider/service/${serviceId}`);
    toast({
      title: "Viewing Service Details",
      description: "Navigating to service details page"
    });
  };

  // Function to navigate to the review page
  const handleViewReviews = () => {
    navigate('/provider/customer-reviews');
    toast({
      title: "Viewing Customer Reviews",
      description: "Navigating to all customer reviews"
    });
  };

  // Function to navigate to photo management
  const handleManagePhotos = () => {
    navigate('/provider/gallery-management');
    toast({
      title: "Gallery Management",
      description: "Navigating to manage your work gallery"
    });
  };

  // Function to handle payment settings
  const handlePaymentSettings = () => {
    navigate('/provider/payment-settings');
    toast({
      title: "Payment Settings",
      description: "Manage your payment methods and billing information"
    });
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Provider Profile Card */}
          <div className="w-full md:w-1/3 space-y-4">
            <Card className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || "P"}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user?.name || "Provider Name"}</h2>
                <p className="text-gray-500 mb-3">{user?.email || "provider@example.com"}</p>
                
                {/* Conditional subscription badge */}
                {subscription?.active && (
                  <div className="mb-4">
                    <Badge variant="subscription">Weekly Subscriber</Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {subscription.type} · Next billing: {subscription.nextBillingDate}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-5 w-5 ${star <= (user?.averageRating || 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    <button 
                      className="hover:underline" 
                      onClick={handleViewReviews}
                    >
                      {user?.averageRating || 4.5} ({user?.reviewCount || 35} reviews)
                    </button>
                  </span>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{user?.location || "San Francisco, CA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>{user?.phone || "(555) 123-4567"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>{user?.email || "provider@example.com"}</span>
                </div>
                {isBusinessUser && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{user?.yearsInBusiness} years in business</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600">
                  {isBusinessUser ? user.description : "No description provided."}
                </p>
              </div>
              
              {subscription?.active ? (
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => navigate('/provider/subscriptions')}
                >
                  Manage Weekly Subscription
                </Button>
              ) : (
                <Button 
                  className="w-full mt-4 bg-hustlr-purple hover:bg-hustlr-purple/90"
                  onClick={() => navigate('/provider/subscriptions')}
                >
                  Start Weekly Subscription
                </Button>
              )}
              
              <Button 
                className="w-full mt-2" 
                variant="outline" 
                onClick={handlePaymentSettings}
              >
                Payment Settings
              </Button>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                size="sm"
                onClick={() => navigate('/provider/business-hours')}
              >
                Edit Business Hours
              </Button>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="services" onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Services Offered</h2>
                  <Button onClick={() => navigate('/provider/add-service')}>
                    Add New Service
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {mockServices.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{service.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{service.category}</p>
                            <p className="text-sm">{service.description}</p>
                            <div className="mt-2 flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm ml-1">
                                <button
                                  className="hover:underline"
                                  onClick={() => navigate(`/provider/service/${service.id}/reviews`)}
                                >
                                  {service.rating} ({service.reviewCount} reviews)
                                </button>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">${service.price}/hr</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleViewServiceDetails(service.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Customer Reviews</h2>
                  <Button onClick={handleViewReviews}>
                    View All Reviews
                  </Button>
                </div>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{review.user[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{review.user}</span>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mb-1">{review.comment}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            Service: {mockServices.find(s => s.id === review.serviceId)?.name}
                          </span>
                          <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4">
                  <Button className="w-full" variant="outline" onClick={handleViewReviews}>
                    Load More Reviews
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Work Gallery</h2>
                  <Button onClick={handleManagePhotos}>
                    <Plus className="h-4 w-4 mr-1" /> Manage Gallery
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="relative aspect-square bg-gray-200 rounded-md overflow-hidden group">
                      <img 
                        src="/placeholder.svg" 
                        alt={`Gallery item ${item}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="space-x-2">
                          <Button size="sm" variant="ghost" className="text-white">
                            <Image className="h-4 w-4 mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {subscription?.active ? (
                  <div className="mt-4">
                    <Button onClick={() => navigate('/provider/upload-photos')} className="w-full">
                      <Plus className="h-4 w-4 mr-1" /> Upload More Photos
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                    <p className="mb-2">Upload additional photos with a Weekly Subscription</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/provider/subscriptions')}
                    >
                      View Weekly Plans
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
