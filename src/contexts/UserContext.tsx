import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'consumer' | 'provider';
  avatar?: string;
  location: {
    city: string;
    suburb: string;
    postcode: number;
    state: string;
    country: string;
  };
  rating?: number;
  reviewCount?: number;
  joinedDate: string;
  isVerified: boolean;
  preferences: {
    language: string;
    notifications: boolean;
    marketingConsent: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Provider extends User {
  userType: 'provider';
  businessName: string;
  abn: string;
  services: string[]; // Service IDs
  specialties: string[];
  experience: number; // Years of experience
  insurance: boolean;
  certifications: string[];
  availability: {
    monday: { start: string; end: string }[];
    tuesday: { start: string; end: string }[];
    wednesday: { start: string; end: string }[];
    thursday: { start: string; end: string }[];
    friday: { start: string; end: string }[];
    saturday: { start: string; end: string }[];
    sunday: { start: string; end: string }[];
  };
  completedJobs: number;
  totalEarnings: number;
  businessDetails: {
    type: 'sole-trader' | 'company' | 'partnership';
    registrationDate: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
    businessHours: {
      monday: { open: string; close: string };
      tuesday: { open: string; close: string };
      wednesday: { open: string; close: string };
      thursday: { open: string; close: string };
      friday: { open: string; close: string };
      saturday: { open: string; close: string };
      sunday: { open: string; close: string };
    };
    serviceArea: {
      radius: number; // in kilometers
      suburbs: string[];
    };
    paymentMethods: {
      cash: boolean;
      card: boolean;
      bankTransfer: boolean;
      paypal: boolean;
    };
  };
  portfolio: {
    images: string[];
    videos: string[];
    projects: {
      id: string;
      title: string;
      description: string;
      images: string[];
      completionDate: string;
      clientFeedback?: string;
    }[];
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    recentReviews: {
      id: string;
      rating: number;
      comment: string;
      date: string;
      clientName: string;
      serviceType: string;
    }[];
  };
  pricing: {
    hourlyRate: number;
    minimumCharge: number;
    cancellationFee: number;
    depositRequired: boolean;
    depositPercentage: number;
  };
  emergency: {
    available: boolean;
    surcharge: number;
    responseTime: number; // in minutes
  };
}

export interface Consumer extends User {
  userType: 'consumer';
  savedProviders: string[]; // Provider IDs
  bookingHistory: string[]; // Booking IDs
  favoriteServices: string[]; // Service IDs
  paymentMethods: {
    id: string;
    type: 'credit' | 'debit';
    last4: string;
    expiryDate: string;
    cardholderName: string;
    isDefault: boolean;
    brand: 'visa' | 'mastercard' | 'amex';
  }[];
  addressBook: {
    id: string;
    name: string;
    address: {
      street: string;
      suburb: string;
      city: string;
      state: string;
      postcode: number;
      country: string;
    };
    isDefault: boolean;
    type: 'home' | 'work' | 'other';
  }[];
  consumerPreferences: {
    preferredContactMethod: 'email' | 'phone' | 'sms';
    preferredTimeSlots: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
    serviceReminders: boolean;
    marketingEmails: boolean;
    smsNotifications: boolean;
  };
  loyaltyPoints: {
    total: number;
    history: {
      id: string;
      points: number;
      type: 'earn' | 'redeem';
      date: string;
      description: string;
    }[];
  };
  recentSearches: {
    id: string;
    query: string;
    date: string;
    filters: {
      category?: string;
      priceRange?: { min: number; max: number };
      rating?: number;
      location?: string;
    };
  }[];
}

// Australian cities and suburbs with states
const AUSTRALIAN_LOCATIONS = [
  { 
    city: 'Sydney', 
    state: 'NSW',
    suburbs: ['CBD', 'Bondi', 'Manly', 'Parramatta', 'Chatswood', 'Surry Hills', 'Newtown', 'Glebe', 'Darlinghurst', 'Paddington'] 
  },
  { 
    city: 'Melbourne', 
    state: 'VIC',
    suburbs: ['CBD', 'St Kilda', 'Fitzroy', 'Richmond', 'South Yarra', 'Carlton', 'Brunswick', 'Prahran', 'Hawthorn', 'Toorak'] 
  },
  { 
    city: 'Brisbane', 
    state: 'QLD',
    suburbs: ['CBD', 'Fortitude Valley', 'New Farm', 'West End', 'Paddington', 'Teneriffe', 'Bulimba', 'Ascot', 'Hamilton', 'Clayfield'] 
  },
  { 
    city: 'Perth', 
    state: 'WA',
    suburbs: ['CBD', 'Fremantle', 'Subiaco', 'Leederville', 'Mount Lawley', 'Cottesloe', 'Claremont', 'Nedlands', 'Applecross', 'Dalkeith'] 
  },
  { 
    city: 'Adelaide', 
    state: 'SA',
    suburbs: ['CBD', 'Glenelg', 'Norwood', 'Unley', 'Prospect', 'Burnside', 'Walkerville', 'Mitcham', 'Brighton', 'Henley Beach'] 
  }
];

// Generate random location
const getRandomLocation = () => {
  const city = AUSTRALIAN_LOCATIONS[Math.floor(Math.random() * AUSTRALIAN_LOCATIONS.length)];
  const suburb = city.suburbs[Math.floor(Math.random() * city.suburbs.length)];
  return {
    city: city.city,
    suburb,
    postcode: Math.floor(Math.random() * 9999) + 2000,
    state: city.state,
    country: 'Australia'
  };
};

// Generate random date within last 2 years
const getRandomJoinDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 2));
  return date.toISOString().split('T')[0];
};

// Generate random time
const getRandomTime = (startHour: number, endHour: number) => {
  const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Generate mock providers
const generateMockProviders = (count: number): Provider[] => {
  const providers: Provider[] = [];
  const businessTypeOptions = ['Services', 'Solutions', 'Experts', 'Pro', 'Specialists'];
  const specialties = ['Residential', 'Commercial', 'Industrial', 'Emergency', 'Maintenance'];
  const certifications = ['Licensed', 'Certified', 'Registered', 'Accredited', 'Qualified'];
  const businessStructureTypes = ['sole-trader', 'company', 'partnership'] as const;
  const cardBrands = ['visa', 'mastercard', 'amex'] as const;

  for (let i = 0; i < count; i++) {
    const location = getRandomLocation();
    const businessType = businessTypeOptions[Math.floor(Math.random() * businessTypeOptions.length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    const certification = certifications[Math.floor(Math.random() * certifications.length)];
    const businessStructure = businessStructureTypes[Math.floor(Math.random() * businessStructureTypes.length)];

    providers.push({
      id: `provider-${i + 1}`,
      name: `John Smith ${i + 1}`,
      email: `provider${i + 1}@example.com`,
      phone: `04${Math.floor(Math.random() * 100000000) + 100000000}`,
      userType: 'provider',
      avatar: `/images/avatars/provider-${(i % 5) + 1}.jpg`,
      location,
      rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 100) + 10,
      joinedDate: getRandomJoinDate(),
      isVerified: Math.random() > 0.2,
      preferences: {
        language: 'en',
        notifications: true,
        marketingConsent: Math.random() > 0.5,
        theme: ['light', 'dark', 'system'][Math.floor(Math.random() * 3)] as 'light' | 'dark' | 'system'
      },
      lastActive: new Date().toISOString(),
      status: 'active',
      businessName: `${specialty} ${businessType}`,
      abn: `${Math.floor(Math.random() * 10000000000) + 10000000000}`,
      services: [],
      specialties: [specialty],
      experience: Math.floor(Math.random() * 20) + 1,
      insurance: Math.random() > 0.1,
      certifications: [`${certification} ${specialty} Professional`],
      availability: {
        monday: [{ start: getRandomTime(8, 10), end: getRandomTime(16, 18) }],
        tuesday: [{ start: getRandomTime(8, 10), end: getRandomTime(16, 18) }],
        wednesday: [{ start: getRandomTime(8, 10), end: getRandomTime(16, 18) }],
        thursday: [{ start: getRandomTime(8, 10), end: getRandomTime(16, 18) }],
        friday: [{ start: getRandomTime(8, 10), end: getRandomTime(16, 18) }],
        saturday: [{ start: getRandomTime(9, 11), end: getRandomTime(14, 16) }],
        sunday: []
      },
      completedJobs: Math.floor(Math.random() * 500) + 50,
      totalEarnings: Math.floor(Math.random() * 100000) + 10000,
      businessDetails: {
        type: businessStructure,
        registrationDate: getRandomJoinDate(),
        website: Math.random() > 0.3 ? `https://www.${specialty.toLowerCase()}${businessType.toLowerCase()}.com.au` : undefined,
        socialMedia: Math.random() > 0.2 ? {
          facebook: `https://facebook.com/${specialty.toLowerCase()}${businessType.toLowerCase()}`,
          instagram: `https://instagram.com/${specialty.toLowerCase()}${businessType.toLowerCase()}`,
          linkedin: `https://linkedin.com/company/${specialty.toLowerCase()}${businessType.toLowerCase()}`
        } : undefined,
        businessHours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '10:00', close: '15:00' },
          sunday: { open: '00:00', close: '00:00' }
        },
        serviceArea: {
          radius: Math.floor(Math.random() * 20) + 5,
          suburbs: [location.suburb]
        },
        paymentMethods: {
          cash: true,
          card: Math.random() > 0.1,
          bankTransfer: Math.random() > 0.2,
          paypal: Math.random() > 0.5
        }
      },
      portfolio: {
        images: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, index) => 
          `/images/portfolio/${specialty.toLowerCase()}-${index + 1}.jpg`
        ),
        videos: Math.random() > 0.7 ? [
          `/videos/portfolio/${specialty.toLowerCase()}-1.mp4`
        ] : [],
        projects: Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, index) => ({
          id: `project-${i}-${index}`,
          title: `${specialty} Project ${index + 1}`,
          description: `Completed ${specialty.toLowerCase()} project in ${location.suburb}`,
          images: [`/images/projects/${specialty.toLowerCase()}-${index + 1}.jpg`],
          completionDate: getRandomJoinDate(),
          clientFeedback: Math.random() > 0.3 ? 'Excellent work, highly recommended!' : undefined
        }))
      },
      reviews: {
        averageRating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
        totalReviews: Math.floor(Math.random() * 100) + 10,
        recentReviews: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, index) => ({
          id: `review-${i}-${index}`,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: 'Great service, very professional!',
          date: getRandomJoinDate(),
          clientName: `Client ${index + 1}`,
          serviceType: specialty
        }))
      },
      pricing: {
        hourlyRate: Math.floor(Math.random() * 50) + 50,
        minimumCharge: Math.floor(Math.random() * 100) + 100,
        cancellationFee: Math.floor(Math.random() * 50) + 20,
        depositRequired: Math.random() > 0.3,
        depositPercentage: Math.floor(Math.random() * 20) + 10
      },
      emergency: {
        available: Math.random() > 0.3,
        surcharge: Math.floor(Math.random() * 50) + 30,
        responseTime: Math.floor(Math.random() * 60) + 30
      }
    });
  }

  return providers;
};

// Generate mock consumers
const generateMockConsumers = (count: number): Consumer[] => {
  const consumers: Consumer[] = [];
  const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const cardBrands = ['visa', 'mastercard', 'amex'] as const;

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const location = getRandomLocation();
    const cardBrand = cardBrands[Math.floor(Math.random() * cardBrands.length)];

    consumers.push({
      id: `consumer-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `consumer${i + 1}@example.com`,
      phone: `04${Math.floor(Math.random() * 100000000) + 100000000}`,
      userType: 'consumer',
      avatar: `/images/avatars/consumer-${(i % 5) + 1}.jpg`,
      location,
      joinedDate: getRandomJoinDate(),
      isVerified: Math.random() > 0.3,
      preferences: {
        language: 'en',
        notifications: true,
        marketingConsent: Math.random() > 0.5,
        theme: ['light', 'dark', 'system'][Math.floor(Math.random() * 3)] as 'light' | 'dark' | 'system'
      },
      lastActive: new Date().toISOString(),
      status: 'active',
      savedProviders: [],
      bookingHistory: [],
      favoriteServices: [],
      paymentMethods: [{
        id: `pm-${i + 1}`,
        type: Math.random() > 0.5 ? 'credit' : 'debit',
        last4: `${Math.floor(Math.random() * 9000) + 1000}`,
        expiryDate: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 5) + 25}`,
        cardholderName: `${firstName} ${lastName}`,
        isDefault: true,
        brand: cardBrand
      }],
      addressBook: [{
        id: `addr-${i + 1}`,
        name: 'Home',
        address: {
          street: `${Math.floor(Math.random() * 100) + 1} ${['Main', 'High', 'Park', 'Queen', 'King'][Math.floor(Math.random() * 5)]} Street`,
          suburb: location.suburb,
          city: location.city,
          state: location.state,
          postcode: location.postcode,
          country: 'Australia'
        },
        isDefault: true,
        type: 'home'
      }],
      consumerPreferences: {
        preferredContactMethod: ['email', 'phone', 'sms'][Math.floor(Math.random() * 3)] as 'email' | 'phone' | 'sms',
        preferredTimeSlots: {
          morning: Math.random() > 0.3,
          afternoon: Math.random() > 0.3,
          evening: Math.random() > 0.5
        },
        serviceReminders: Math.random() > 0.2,
        marketingEmails: Math.random() > 0.5,
        smsNotifications: Math.random() > 0.3
      },
      loyaltyPoints: {
        total: Math.floor(Math.random() * 1000),
        history: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, index) => ({
          id: `points-${i}-${index}`,
          points: Math.floor(Math.random() * 100) + 10,
          type: Math.random() > 0.3 ? 'earn' : 'redeem',
          date: getRandomJoinDate(),
          description: Math.random() > 0.3 ? 'Service booking' : 'Points redemption'
        }))
      },
      recentSearches: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, index) => ({
        id: `search-${i}-${index}`,
        query: ['plumbing', 'cleaning', 'electrical', 'painting', 'gardening'][Math.floor(Math.random() * 5)],
        date: getRandomJoinDate(),
        filters: {
          category: ['home', 'commercial', 'emergency'][Math.floor(Math.random() * 3)],
          priceRange: Math.random() > 0.3 ? {
            min: Math.floor(Math.random() * 50) + 50,
            max: Math.floor(Math.random() * 100) + 150
          } : undefined,
          rating: Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 4 : undefined,
          location: Math.random() > 0.3 ? location.suburb : undefined
        }
      }))
    });
  }

  return consumers;
};

// Generate initial mock data
const mockProviders = generateMockProviders(100);
const mockConsumers = generateMockConsumers(200);

interface UserContextType {
  providers: Provider[];
  consumers: Consumer[];
  getProvider: (id: string) => Provider | undefined;
  getConsumer: (id: string) => Consumer | undefined;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  updateConsumer: (id: string, updates: Partial<Consumer>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [consumers, setConsumers] = useState<Consumer[]>(mockConsumers);

  const getProvider = (id: string) => {
    return providers.find(provider => provider.id === id);
  };

  const getConsumer = (id: string) => {
    return consumers.find(consumer => consumer.id === id);
  };

  const updateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders(prevProviders =>
      prevProviders.map(provider =>
        provider.id === id ? { ...provider, ...updates } : provider
      )
    );
  };

  const updateConsumer = (id: string, updates: Partial<Consumer>) => {
    setConsumers(prevConsumers =>
      prevConsumers.map(consumer =>
        consumer.id === id ? { ...consumer, ...updates } : consumer
      )
    );
  };

  return (
    <UserContext.Provider value={{
      providers,
      consumers,
      getProvider,
      getConsumer,
      updateProvider,
      updateConsumer
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 