
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Clock, PenLine, Users, Check, X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/hooks/use-toast";

// Define comprehensive data types for the service details page
export interface ProviderServiceImage {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
  caption?: string;
  featured: boolean;
  order: number;
  uploadDate: string;
  fileSize: number;
  fileType: string;
}

export interface ProviderServicePricing {
  hourlyRate: number;
  minimumHours: number;
  flatRate?: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  weekendSurcharge?: number;
  emergencyRate?: number;
  materialsCost?: number;
  materialsCostIncluded: boolean;
  travelFee?: number;
  travelRadius: number;
  cancellationFee?: number;
  deposit?: number;
  depositPercentage?: number;
}

export interface ProviderServiceAvailability {
  monday: { available: boolean; startTime?: string; endTime?: string; };
  tuesday: { available: boolean; startTime?: string; endTime?: string; };
  wednesday: { available: boolean; startTime?: string; endTime?: string; };
  thursday: { available: boolean; startTime?: string; endTime?: string; };
  friday: { available: boolean; startTime?: string; endTime?: string; };
  saturday: { available: boolean; startTime?: string; endTime?: string; };
  sunday: { available: boolean; startTime?: string; endTime?: string; };
  exceptions: Array<{
    date: string;
    available: boolean;
    startTime?: string;
    endTime?: string;
    reason?: string;
  }>;
  leadTime: number;
  maxBookingWindow: number;
}

export interface ServiceFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  iconName?: string;
  highlight: boolean;
}

export interface ServiceReview {
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
  reported: boolean;
  verified: boolean;
  servicePurchased: boolean;
  photos?: string[];
}

export interface ServiceAnalytics {
  views: number;
  clicks: number;
  inquiries: number;
  bookings: number;
  completionRate: number;
  averageResponseTime: number;
  conversionRate: number;
  popularityRank: number;
  searchRank: number;
  lastUpdated: string;
}

export interface ServiceSeo {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  openGraph: {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
  };
}

export interface ProviderService {
  id: string;
  name: string;
  description: string;
  providerId: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  featured: boolean;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
  pricing: ProviderServicePricing;
  availability: ProviderServiceAvailability;
  images: ProviderServiceImage[];
  features: ServiceFeature[];
  requirements?: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  rating: number;
  reviewCount: number;
  reviews: ServiceReview[];
  analytics: ServiceAnalytics;
  seo: ServiceSeo;
  tags: string[];
  bookingCount: number;
  completedBookingCount: number;
}

export default function ProviderServiceDetails() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ProviderService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'reviews' | 'settings'>('overview');

  useEffect(() => {
    // In a real app, fetch service data from an API
    // For demo purposes, use mock data
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        
        // Mock service data
        const mockService: ProviderService = {
          id: serviceId || 's1',
          name: 'House Painting',
          description: 'Professional interior and exterior painting services with premium materials.',
          providerId: 'p1',
          categoryId: 'c1',
          categoryName: 'Home Improvement',
          subcategoryId: 'sc1',
          subcategoryName: 'Painting',
          featured: true,
          status: 'active',
          createdAt: '2023-01-15T08:30:00Z',
          updatedAt: '2023-05-20T14:15:00Z',
          pricing: {
            hourlyRate: 50,
            minimumHours: 2,
            flatRate: 0,
            discount: 10,
            discountType: 'percentage',
            weekendSurcharge: 10,
            materialsCostIncluded: false,
            travelRadius: 25,
          },
          availability: {
            monday: { available: true, startTime: '08:00', endTime: '17:00' },
            tuesday: { available: true, startTime: '08:00', endTime: '17:00' },
            wednesday: { available: true, startTime: '08:00', endTime: '17:00' },
            thursday: { available: true, startTime: '08:00', endTime: '17:00' },
            friday: { available: true, startTime: '08:00', endTime: '17:00' },
            saturday: { available: true, startTime: '09:00', endTime: '15:00' },
            sunday: { available: false },
            exceptions: [],
            leadTime: 2,
            maxBookingWindow: 60,
          },
          images: Array(6).fill(null).map((_, i) => ({
            id: `img-${i+1}`,
            url: '/placeholder.svg',
            altText: `House painting sample ${i+1}`,
            width: 800,
            height: 600,
            featured: i === 0,
            order: i,
            uploadDate: '2023-01-15T08:30:00Z',
            fileSize: 150000,
            fileType: 'image/jpeg'
          })),
          features: [
            { id: 'f1', name: 'Interior Painting', description: 'Full interior wall painting', included: true, highlight: true },
            { id: 'f2', name: 'Exterior Painting', description: 'House exterior and trim painting', included: true, highlight: true },
            { id: 'f3', name: 'Wallpaper Removal', description: 'Removal of old wallpaper', included: true, highlight: false },
            { id: 'f4', name: 'Drywall Repair', description: 'Fix holes and imperfections', included: true, highlight: false },
          ],
          requirements: [
            'Clear access to all areas that need painting',
            'Furniture moved or covered',
            'Pets secured in a separate area'
          ],
          faqs: [
            { question: 'How long does it take to paint a room?', answer: 'A standard room typically takes 4-6 hours depending on preparation needs and complexity.' },
            { question: 'Do you provide the paint?', answer: 'Yes, we provide all materials including premium quality paint.' },
          ],
          rating: 4.8,
          reviewCount: 24,
          reviews: Array(5).fill(null).map((_, i) => ({
            id: `rev-${i+1}`,
            userId: `u${i+1}`,
            userName: ['Michael B.', 'Sarah T.', 'Robert J.', 'Emma L.', 'David K.'][i],
            rating: [5, 4, 5, 5, 4][i],
            comment: 'Great service, very professional and completed the job perfectly.',
            date: `2023-0${5-i}-15T10:30:00Z`,
            helpful: Math.floor(Math.random() * 10),
            reported: false,
            verified: true,
            servicePurchased: true
          })),
          analytics: {
            views: 342,
            clicks: 128,
            inquiries: 45,
            bookings: 26,
            completionRate: 96,
            averageResponseTime: 2.3,
            conversionRate: 20.3,
            popularityRank: 3,
            searchRank: 5,
            lastUpdated: '2023-06-01T00:00:00Z'
          },
          seo: {
            title: 'Professional House Painting Services',
            description: 'High-quality interior and exterior painting services with premium materials and expert painters.',
            keywords: ['house painting', 'interior painting', 'exterior painting', 'professional painters'],
            openGraph: {
              title: 'Professional House Painting Services',
              description: 'Transform your home with our expert painting services',
              imageUrl: '/placeholder.svg',
              imageAlt: 'House painting service'
            }
          },
          tags: ['interior', 'exterior', 'residential', 'commercial', 'eco-friendly'],
          bookingCount: 26,
          completedBookingCount: 25
        };

        // Simulate API delay
        setTimeout(() => {
          setService(mockService);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching service details:', error);
        toast({
          title: 'Error',
          description: 'Could not load service details',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId]);

  const handleEditService = () => {
    if (!service) return;
    navigate(`/provider/edit-service/${service.id}`);
  };

  const handleToggleActiveStatus = () => {
    if (!service) return;
    const newStatus = service.status === 'active' ? 'inactive' : 'active';
    
    toast({
      title: `Service ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `${service.name} is now ${newStatus === 'active' ? 'visible to' : 'hidden from'} customers`,
    });

    setService({
      ...service,
      status: newStatus as 'active' | 'inactive' | 'pending' | 'rejected'
    });
  };

  if (loading) {
    return (
      <div>
        <AppHeader />
        <div className="container mx-auto p-4 max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <AppHeader />
        <div className="container mx-auto p-4 max-w-6xl">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Service not found</h2>
            <p className="mt-2">The service you're looking for might have been removed or doesn't exist.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/provider/profile')}
            >
              Return to Profile
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Service Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={service.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </Badge>
              <Badge variant="outline">{service.categoryName}</Badge>
              {service.featured && <Badge className="bg-hustlr-purple">Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-4 w-4 ${star <= service.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-sm">{service.rating} ({service.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleEditService}>
              Edit Service
            </Button>
            <Button 
              variant={service.status === 'active' ? 'destructive' : 'default'}
              onClick={handleToggleActiveStatus}
            >
              {service.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>

        {/* Service Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content - Left 2/3 */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {service.images.slice(0, 6).map((image, index) => (
                    <div 
                      key={image.id} 
                      className={`rounded-lg overflow-hidden ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                    >
                      <AspectRatio ratio={index === 0 ? 16/9 : 4/3}>
                        <img 
                          src={image.url} 
                          alt={image.altText} 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  ))}
                </div>
                
                <h2 className="text-xl font-bold mb-3">Service Description</h2>
                <p className="text-gray-700">{service.description}</p>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Features Included</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.features.map(feature => (
                      <li key={feature.id} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className={feature.highlight ? "font-medium" : ""}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {service.requirements && service.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {service.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Reviews & Ratings</h2>
                <div className="space-y-4">
                  {service.reviews.map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{review.userName}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
                {service.reviews.length > 5 && (
                  <Button variant="ghost" className="w-full mt-4">
                    View All Reviews
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - Right 1/3 */}
          <div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Pricing</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hourly Rate</span>
                      <span className="font-bold">${service.pricing.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum Hours</span>
                      <span>{service.pricing.minimumHours} hours</span>
                    </div>
                    {service.pricing.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>
                          {service.pricing.discount}
                          {service.pricing.discountType === 'percentage' ? '%' : '$'} off
                        </span>
                      </div>
                    )}
                    {service.pricing.weekendSurcharge && (
                      <div className="flex justify-between">
                        <span>Weekend Surcharge</span>
                        <span>{service.pricing.weekendSurcharge}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Availability</h3>
                  <div className="space-y-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
                      (day) => {
                        const dayData = service.availability[day as keyof typeof service.availability] as {
                          available: boolean;
                          startTime?: string;
                          endTime?: string;
                        };
                        
                        return (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize">{day}</span>
                            <span>
                              {dayData.available 
                                ? `${dayData.startTime} - ${dayData.endTime}`
                                : "Not Available"}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Service Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Bookings</span>
                      <span>{service.bookingCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span>{service.completedBookingCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span>{service.analytics.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span>{service.analytics.averageResponseTime} hrs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
