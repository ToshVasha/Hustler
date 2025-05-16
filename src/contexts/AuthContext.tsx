
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define User Types
export type UserType = "consumer" | "business";

interface Subscription {
  active: boolean;
  type: string;
  nextBillingDate: string;
  startedOn: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
  password: string; // NOTE: In a real app, we would never store password directly
  phone: string;
  location: string;
  averageRating: number;
  reviewCount: number;
  subscription?: Subscription;
}

interface BusinessUser extends User {
  type: "business";
  yearsInBusiness: number;
  description: string;
}

interface ConsumerUser extends User {
  type: "consumer";
  yearsInBusiness?: never; // Make non-existent for consumer
  description?: never; // Make non-existent for consumer
}

type AnyUser = BusinessUser | ConsumerUser;

interface ConsumerData {
  recentBookings: number;
  totalSpent: number;
}

interface AuthContextType {
  user: AnyUser | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  consumerData?: ConsumerData;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (user: Partial<AnyUser>) => void;
  updateUser: (updates: Partial<AnyUser>) => void;
  requestPasswordReset: (email: string) => void;
  resetPassword: (token: string, newPassword: string) => void;
  updateSubscription: (subscriptionData: Subscription) => void;
  getServiceProviderById?: (providerId: string) => BusinessUser | null;
}

// Mock user data
const MOCK_USERS: AnyUser[] = [
  {
    id: "c123",
    name: "John Consumer",
    email: "consumer@example.com",
    type: "consumer",
    password: "password",
    phone: "555-123-4567",
    location: "New York",
    averageRating: 4.7,
    reviewCount: 12,
    subscription: {
      active: true,
      type: "Basic Weekly",
      nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      startedOn: new Date().toLocaleDateString()
    }
  },
  {
    id: "b123",
    name: "Jane Business",
    email: "business@example.com",
    type: "business",
    password: "password",
    phone: "555-987-6543",
    location: "Boston",
    yearsInBusiness: 5,
    description: "Professional painting services for residential and commercial clients.",
    averageRating: 4.9,
    reviewCount: 48,
    subscription: {
      active: true,
      type: "Pro Weekly",
      nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      startedOn: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AnyUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [consumerData, setConsumerData] = useState<ConsumerData>({
    recentBookings: 3,
    totalSpent: 125
  });

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as AnyUser;
        setUser(parsedUser);
        setUserType(parsedUser.type);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Function to get service provider by ID
  const getServiceProviderById = (providerId: string): BusinessUser | null => {
    const provider = MOCK_USERS.find(u => u.id === providerId && u.type === "business");
    if (provider && provider.type === "business") {
      return provider;
    }
    return null;
  };

  const login = (email: string, password: string): void => {
    // In a real app, this would make an API call to validate credentials
    const foundUser = MOCK_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (foundUser) {
      // In a real app, we would check password hash against stored hash
      // For demo purposes, we'll accept any non-empty password
      if (password) {
        setUser(foundUser);
        setUserType(foundUser.type);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        toast.error("Invalid password");
      }
    } else {
      toast.error("User not found");
    }
  };

  const logout = (): void => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  const signup = (userData: Partial<AnyUser>): void => {
    // In a real app, this would make an API call to register the user
    
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === userData.email)) {
      toast.error("Email already registered");
      return;
    }
    
    // Create new user with defaults
    let newUser: AnyUser;
    
    if (userData.type === "business") {
      newUser = {
        id: `u${Date.now()}`, // Generate a unique ID
        name: userData.name || "New User",
        email: userData.email || "",
        type: "business",
        password: userData.password || "",
        phone: userData.phone || "",
        location: userData.location || "",
        averageRating: 0,
        reviewCount: 0,
        yearsInBusiness: userData.yearsInBusiness || 0,
        description: userData.description || "",
        // Add default subscription data
        subscription: {
          active: false,
          type: "Free",
          nextBillingDate: "",
          startedOn: ""
        }
      };
    } else {
      newUser = {
        id: `u${Date.now()}`, // Generate a unique ID
        name: userData.name || "New User",
        email: userData.email || "",
        type: "consumer",
        password: userData.password || "",
        phone: userData.phone || "",
        location: userData.location || "",
        averageRating: 0,
        reviewCount: 0,
        // Add default subscription data
        subscription: {
          active: false,
          type: "Free",
          nextBillingDate: "",
          startedOn: ""
        }
      };
    }
    
    // Add user to mock database
    MOCK_USERS.push(newUser);
    
    // Log in the new user
    setUser(newUser);
    setUserType(newUser.type);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    toast.success("Account created successfully!");
  };

  const updateUser = (updates: Partial<AnyUser>): void => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    // Update the user
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser as AnyUser);
    
    // Update in mock database
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = updatedUser as AnyUser;
    }
    
    // Update in local storage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    toast.success("Profile updated successfully");
  };

  const updateSubscription = (subscriptionData: Subscription): void => {
    if (!user) {
      toast.error("You must be logged in to update your subscription");
      return;
    }
    
    // Update the user's subscription
    const updatedUser = { 
      ...user, 
      subscription: subscriptionData 
    };
    setUser(updatedUser as AnyUser);
    
    // Update in mock database
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = updatedUser as AnyUser;
    }
    
    // Update in local storage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    toast.success("Subscription updated successfully");
  };

  const requestPasswordReset = (email: string): void => {
    // In a real app, this would send a reset email with a token
    // For demo, we'll just show a success message
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      toast.success("Password reset link sent to your email");
    } else {
      toast.error("Email not found");
    }
  };

  const resetPassword = (token: string, newPassword: string): void => {
    // In a real app, this would validate the token and update the password
    // For demo, we'll just show a success message
    toast.success("Password reset successfully");
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      isAuthenticated,
      consumerData,
      login,
      logout,
      signup,
      updateUser,
      updateSubscription,
      requestPasswordReset,
      resetPassword,
      getServiceProviderById
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
