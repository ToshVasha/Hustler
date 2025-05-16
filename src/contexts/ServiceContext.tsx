import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: "hour" | "job";
  imageUrl: string;
  rating: number;
  reviewCount: number;
  providerId: string;
  category: string;
  location: {
    city: string;
    suburb: string;
    postcode: number;
  };
}

interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ServiceContextType {
  services: Service[];
  reviews: Record<string, Review[]>;
  addService: (service: Omit<Service, "id" | "rating" | "reviewCount">) => Service;
  updateService: (id: string, updates: Partial<Omit<Service, "id">>) => Service | null;
  deleteService: (id: string) => boolean;
  getServicesByProvider: (providerId: string) => Service[];
  addReview: (review: Omit<Review, "id" | "date">) => Review;
  getServiceReviews: (serviceId: string) => Review[];
}

// Australian cities and suburbs for mock data
const AUSTRALIAN_LOCATIONS = [
  { city: 'Sydney', suburbs: ['CBD', 'Bondi', 'Manly', 'Parramatta', 'Chatswood'] },
  { city: 'Melbourne', suburbs: ['CBD', 'St Kilda', 'Fitzroy', 'Richmond', 'South Yarra'] },
  { city: 'Brisbane', suburbs: ['CBD', 'Fortitude Valley', 'New Farm', 'West End', 'Paddington'] },
  { city: 'Perth', suburbs: ['CBD', 'Fremantle', 'Subiaco', 'Leederville', 'Mount Lawley'] },
  { city: 'Adelaide', suburbs: ['CBD', 'Glenelg', 'Norwood', 'Unley', 'Prospect'] }
];

// Generate random price within range
const getRandomPrice = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random rating
const getRandomRating = () => {
  return Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1));
};

// Generate random review count
const getRandomReviewCount = () => {
  return Math.floor(Math.random() * 50) + 5;
};

// Generate mock services
const generateMockServices = (): Service[] => {
  const services: Service[] = [];
  const categories = ['painting', 'cleaning', 'plumbing', 'electrical', 'repair'];
  const priceRanges = {
    painting: { min: 50, max: 150 },
    cleaning: { min: 30, max: 100 },
    plumbing: { min: 80, max: 200 },
    electrical: { min: 70, max: 180 },
    repair: { min: 60, max: 160 }
  };

  // Generate 100 services for each category
  categories.forEach(category => {
    for (let i = 0; i < 100; i++) {
      const location = AUSTRALIAN_LOCATIONS[Math.floor(Math.random() * AUSTRALIAN_LOCATIONS.length)];
      const suburb = location.suburbs[Math.floor(Math.random() * location.suburbs.length)];
      const price = getRandomPrice(priceRanges[category].min, priceRanges[category].max);
      
      services.push({
        id: `${category}-${i + 1}`,
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Service in ${suburb}`,
        description: `Professional ${category} services in ${suburb}, ${location.city}. Experienced team, quality work, and competitive rates.`,
        price,
        priceType: Math.random() > 0.5 ? "hour" : "job",
        imageUrl: '/images/placeholders/service-placeholder.png',
        rating: getRandomRating(),
        reviewCount: getRandomReviewCount(),
        providerId: `provider-${Math.floor(Math.random() * 50) + 1}`,
        category,
        location: {
          city: location.city,
          suburb: suburb,
          postcode: Math.floor(Math.random() * 9999) + 2000
        }
      });
    }
  });

  return services;
};

// Initial mock services
const defaultServices: Service[] = generateMockServices();

// Generate mock reviews
const generateMockReviews = (): Record<string, Review[]> => {
  const reviews: Record<string, Review[]> = {};
  const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const comments = [
    'Excellent service, very professional and timely.',
    'Great work, would definitely recommend!',
    'Very satisfied with the quality of work.',
    'Prompt service and good communication.',
    'Reasonable prices and excellent results.',
    'Highly recommended for their expertise.',
    'Very thorough and professional.',
    'Great value for money.',
    'Excellent attention to detail.',
    'Very reliable and trustworthy.'
  ];

  // Generate reviews for each service
  defaultServices.forEach(service => {
    const reviewCount = Math.floor(Math.random() * 5) + 1; // 1-5 reviews per service
    const serviceReviews: Review[] = [];

    for (let i = 0; i < reviewCount; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days

      serviceReviews.push({
        id: `review-${service.id}-${i + 1}`,
        serviceId: service.id,
        userId: `user-${Math.floor(Math.random() * 100) + 1}`,
        userName: `${firstName} ${lastName}`,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        comment: comments[Math.floor(Math.random() * comments.length)],
        date: date.toISOString().split('T')[0]
      });
    }

    reviews[service.id] = serviceReviews;
  });

  return reviews;
};

// Mock reviews for services
const MOCK_REVIEWS: Record<string, Review[]> = generateMockReviews();

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [reviews, setReviews] = useState<Record<string, Review[]>>(MOCK_REVIEWS);

  // Add a new service
  const addService = (serviceData: Omit<Service, "id" | "rating" | "reviewCount">) => {
    const newService: Service = {
      ...serviceData,
      id: `service-${Date.now()}`,
      rating: 0,
      reviewCount: 0
    };
    
    setServices(prevServices => [...prevServices, newService]);
    toast.success("Service added successfully");
    return newService;
  };

  // Update an existing service
  const updateService = (id: string, updates: Partial<Omit<Service, "id">>) => {
    let updatedService: Service | null = null;
    
    setServices(prevServices => {
      const index = prevServices.findIndex(service => service.id === id);
      if (index === -1) return prevServices;
      
      const updatedServices = [...prevServices];
      updatedServices[index] = {
        ...updatedServices[index],
        ...updates
      };
      
      updatedService = updatedServices[index];
      return updatedServices;
    });
    
    if (updatedService) {
      toast.success("Service updated successfully");
    }
    
    return updatedService;
  };

  // Delete a service
  const deleteService = (id: string) => {
    let deleted = false;
    
    setServices(prevServices => {
      const filteredServices = prevServices.filter(service => service.id !== id);
      deleted = filteredServices.length < prevServices.length;
      return filteredServices;
    });
    
    if (deleted) {
      toast.success("Service deleted successfully");
      // Also remove any reviews for this service
      if (reviews[id]) {
        const newReviews = { ...reviews };
        delete newReviews[id];
        setReviews(newReviews);
      }
    }
    
    return deleted;
  };

  // Get services by provider ID
  const getServicesByProvider = (providerId: string) => {
    return services.filter(service => service.providerId === providerId);
  };

  // Add a review for a service
  const addReview = (reviewData: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews(prevReviews => {
      const serviceReviews = prevReviews[reviewData.serviceId] || [];
      return {
        ...prevReviews,
        [reviewData.serviceId]: [...serviceReviews, newReview]
      };
    });
    
    // Update service rating
    updateServiceRating(reviewData.serviceId);
    
    toast.success("Review submitted successfully");
    return newReview;
  };

  // Get reviews for a specific service
  const getServiceReviews = (serviceId: string) => {
    return reviews[serviceId] || [];
  };

  // Helper to update a service's rating based on reviews
  const updateServiceRating = (serviceId: string) => {
    const serviceReviews = reviews[serviceId] || [];
    if (serviceReviews.length === 0) return;
    
    const totalRating = serviceReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / serviceReviews.length;
    
    updateService(serviceId, {
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: serviceReviews.length
    });
  };

  return (
    <ServiceContext.Provider value={{
      services,
      reviews,
      addService,
      updateService,
      deleteService,
      getServicesByProvider,
      addReview,
      getServiceReviews
    }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useService() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}
