
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  consumerId: string;
  consumerName: string;
  price: number;
  date: string;
  time: string;
  status: "pending" | "upcoming" | "completed" | "canceled";
  notes?: string;
  location?: string;
}

interface BookingContextType {
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, "id">) => Booking;
  updateBookingStatus: (id: string, status: Booking["status"]) => boolean;
  getBookingsByConsumer: (consumerId: string) => Booking[];
  getBookingsByProvider: (providerId: string) => Booking[];
  getUpcomingBookings: (userId: string, userType: 'consumer' | 'business') => Booking[];
  getCompletedBookings: (userId: string, userType: 'consumer' | 'business') => Booking[];
  getCanceledBookings: (userId: string, userType: 'consumer' | 'business') => Booking[];
  getPendingBookings: (providerId: string) => Booking[];
}

// Mock bookings data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    serviceId: "1",
    serviceName: "House Painting",
    providerId: "b123",
    providerName: "John's Paintin'",
    consumerId: "c456",
    consumerName: "Sandra East",
    price: 120,
    date: "2025-05-10",
    time: "09:00 AM",
    status: "upcoming",
    location: "123 Main St, San Francisco, CA"
  },
  {
    id: "2",
    serviceId: "4",
    serviceName: "Deep Cleaning",
    providerId: "b126",
    providerName: "CleanPro Services",
    consumerId: "c456",
    consumerName: "Sandra East",
    price: 95,
    date: "2025-05-15",
    time: "10:00 AM",
    status: "upcoming",
    location: "123 Main St, San Francisco, CA"
  },
  {
    id: "3",
    serviceId: "2",
    serviceName: "Wall Repairs",
    providerId: "b123",
    providerName: "John's Paintin'",
    consumerId: "c456",
    consumerName: "Sandra East",
    price: 95,
    date: "2025-04-28",
    time: "02:00 PM",
    status: "completed",
    location: "123 Main St, San Francisco, CA"
  },
  {
    id: "4",
    serviceId: "5",
    serviceName: "Office Cleaning",
    providerId: "b126",
    providerName: "CleanPro Services",
    consumerId: "c456",
    consumerName: "Sandra East",
    price: 150,
    date: "2025-04-20",
    time: "11:00 AM",
    status: "completed",
    location: "123 Main St, San Francisco, CA"
  },
  {
    id: "5",
    serviceId: "1",
    serviceName: "House Painting",
    providerId: "b123",
    providerName: "John's Paintin'",
    consumerId: "c457",
    consumerName: "Michael West",
    price: 200,
    date: "2025-04-15",
    time: "09:30 AM",
    status: "canceled",
    location: "456 Oak St, San Francisco, CA"
  },
  {
    id: "6",
    serviceId: "3",
    serviceName: "Custom Murals",
    providerId: "b123",
    providerName: "John's Paintin'",
    consumerId: "c459",
    consumerName: "Julia South",
    price: 300,
    date: "2025-05-25",
    time: "13:00 PM",
    status: "pending",
    notes: "I'd like a space-themed mural for my son's room",
    location: "789 Elm St, Oakland, CA"
  }
];

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  // Create a new booking
  const createBooking = (bookingData: Omit<Booking, "id">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`
    };
    
    setBookings(prevBookings => [...prevBookings, newBooking]);
    toast.success("Booking created successfully");
    return newBooking;
  };

  // Update booking status
  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    let updated = false;
    
    setBookings(prevBookings => {
      const index = prevBookings.findIndex(booking => booking.id === id);
      if (index === -1) return prevBookings;
      
      const updatedBookings = [...prevBookings];
      updatedBookings[index] = {
        ...updatedBookings[index],
        status
      };
      
      updated = true;
      return updatedBookings;
    });
    
    if (updated) {
      const statusMessages = {
        pending: "Booking is now pending approval",
        upcoming: "Booking confirmed",
        completed: "Booking marked as completed",
        canceled: "Booking has been canceled"
      };
      
      toast.success(statusMessages[status]);
    }
    
    return updated;
  };

  // Get bookings by consumer ID
  const getBookingsByConsumer = (consumerId: string) => {
    return bookings.filter(booking => booking.consumerId === consumerId);
  };

  // Get bookings by provider ID
  const getBookingsByProvider = (providerId: string) => {
    return bookings.filter(booking => booking.providerId === providerId);
  };

  // Get upcoming bookings
  const getUpcomingBookings = (userId: string, userType: 'consumer' | 'business') => {
    const idField = userType === 'consumer' ? 'consumerId' : 'providerId';
    return bookings.filter(booking => 
      booking[idField] === userId && booking.status === "upcoming"
    );
  };

  // Get completed bookings
  const getCompletedBookings = (userId: string, userType: 'consumer' | 'business') => {
    const idField = userType === 'consumer' ? 'consumerId' : 'providerId';
    return bookings.filter(booking => 
      booking[idField] === userId && booking.status === "completed"
    );
  };

  // Get canceled bookings
  const getCanceledBookings = (userId: string, userType: 'consumer' | 'business') => {
    const idField = userType === 'consumer' ? 'consumerId' : 'providerId';
    return bookings.filter(booking => 
      booking[idField] === userId && booking.status === "canceled"
    );
  };

  // Get pending bookings (providers only)
  const getPendingBookings = (providerId: string) => {
    return bookings.filter(booking => 
      booking.providerId === providerId && booking.status === "pending"
    );
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      createBooking,
      updateBookingStatus,
      getBookingsByConsumer,
      getBookingsByProvider,
      getUpcomingBookings,
      getCompletedBookings,
      getCanceledBookings,
      getPendingBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
