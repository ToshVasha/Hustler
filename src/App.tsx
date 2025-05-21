
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { MessageProvider } from "@/contexts/MessageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import BusinessDashboard from "./pages/BusinessDashboard";
import MessagesPage from "./pages/MessagesPage";
import ServiceView from "./pages/ServiceView";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ServiceBrowse from "./pages/ServiceBrowse";
import ServiceDiscovery from "./pages/ServiceDiscovery";
import ConsumerProfile from "./pages/ConsumerProfile";
import ProviderProfile from "./pages/ProviderProfile";
import ConsumerDashboard from "./components/ConsumerDashboard";
import ProviderChat from "./pages/ProviderChat";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import NotificationsPage from "./pages/NotificationsPage";
import ProviderJobsPage from "./pages/ProviderJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import ConsumerReviewPage from "./pages/ConsumerReviewPage";
import BookServicePage from "./pages/BookServicePage";
import ConsumerServiceDetails from "./pages/ConsumerServiceDetails";
import ProviderServiceDetails from "./pages/ProviderServiceDetails";
import ProviderReviewPage from "./pages/ProviderReviewPage";
import ConsumerProviderReviews from "./pages/ConsumerProviderReviews";
import AddServicePage from "./pages/AddServicePage";
import ProviderCustomerReviews from "./pages/ProviderCustomerReviews";
import ProviderGalleryManagement from "./pages/ProviderGalleryManagement";
import ProviderPaymentSettings from "./pages/ProviderPaymentSettings";
import ProviderPhotoUpload from "./pages/ProviderPhotoUpload";
import ProviderResponseToReview from "./pages/ProviderResponseToReview";

const queryClient = new QueryClient();

// Protected route wrapper
interface ProtectedRouteProps {
  children: JSX.Element;
  requireAuth?: boolean;
  requireBusinessUser?: boolean;
  requireConsumerUser?: boolean;
}

function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireBusinessUser = false, 
  requireConsumerUser = false
}: ProtectedRouteProps) {
  const { isAuthenticated, userType } = useAuth();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireBusinessUser && userType !== 'business') {
    return <Navigate to="/consumer/dashboard" />;
  }
  
  if (requireConsumerUser && userType !== 'consumer') {
    return <Navigate to="/provider/dashboard" />;
  }
  
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ServiceProvider>
          <BookingProvider>
            <MessageProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Root Route - Redirect based on user type */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <RootRedirect />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Consumer Routes */}
                  <Route 
                    path="/consumer/dashboard" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <ConsumerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/messages" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <MessagesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/messages/:conversationId" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <MessagesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/services" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <ServiceBrowse />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/discover" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <ServiceDiscovery />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/service/:serviceId" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <ServiceView />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/service-details/:serviceId" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <ConsumerServiceDetails />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/book/:serviceId" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <BookServicePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/review/:bookingId" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <ConsumerReviewPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/profile" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <ConsumerProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/settings" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/notifications" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <NotificationsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/subscriptions" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <SubscriptionPlans />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consumer/provider-reviews" 
                    element={
                      <ProtectedRoute requireConsumerUser>
                        <ConsumerProviderReviews />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Provider Routes */}
                  <Route 
                    path="/provider/dashboard" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <BusinessDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/add-service" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <AddServicePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/messages" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderChat />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/jobs" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderJobsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/jobs/:jobId" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <JobDetailPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/review/:bookingId" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderReviewPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/profile" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/settings" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/notifications" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <NotificationsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/subscriptions" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <SubscriptionPlans />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/service/:serviceId" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderServiceDetails />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/customer-reviews" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderCustomerReviews />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/respond-to-review/:reviewId" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderResponseToReview />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/gallery-management" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderGalleryManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/upload-photos" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderPhotoUpload />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/payment-settings" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderPaymentSettings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/service/:serviceId/reviews" 
                    element={
                      <ProtectedRoute requireBusinessUser>
                        <ProviderCustomerReviews />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Legacy routes for compatibility - redirect to new paths */}
                  <Route path="/business" element={<Navigate to="/provider/dashboard" replace />} />
                  <Route path="/messages" element={<Navigate to="/consumer/messages" replace />} />
                  <Route path="/provider-chat" element={<Navigate to="/provider/messages" replace />} />
                  <Route path="/service/:serviceId" element={<Navigate to="/consumer/service/:serviceId" replace />} />
                  <Route path="/settings" element={<Navigate to="/settings-redirect" replace />} />
                  <Route path="/settings-redirect" element={<SettingsRedirect />} />
                  <Route path="/services" element={<Navigate to="/consumer/services" replace />} />
                  <Route path="/discover" element={<Navigate to="/consumer/discover" replace />} />
                  <Route path="/notifications" element={<Navigate to="/notifications-redirect" replace />} />
                  <Route path="/notifications-redirect" element={<NotificationsRedirect />} />
                  <Route path="/jobs" element={<Navigate to="/provider/jobs" replace />} />
                  <Route path="/jobs/:jobId" element={<Navigate to="/provider/jobs/:jobId" replace />} />
                  <Route path="/profile/consumer" element={<Navigate to="/consumer/profile" replace />} />
                  <Route path="/profile/provider" element={<Navigate to="/provider/profile" replace />} />
                  <Route path="/subscriptions" element={<Navigate to="/subscriptions-redirect" replace />} />
                  <Route path="/subscriptions-redirect" element={<SubscriptionsRedirect />} />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </MessageProvider>
          </BookingProvider>
        </ServiceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Helper components for redirects
function RootRedirect() {
  const { userType } = useAuth();
  return userType === 'consumer' ? 
    <Navigate to="/consumer/dashboard" replace /> : 
    <Navigate to="/provider/dashboard" replace />;
}

function SettingsRedirect() {
  const { userType } = useAuth();
  return <Navigate to={userType === 'consumer' ? "/consumer/settings" : "/provider/settings"} replace />;
}

function NotificationsRedirect() {
  const { userType } = useAuth();
  return <Navigate to={userType === 'consumer' ? "/consumer/notifications" : "/provider/notifications"} replace />;
}

function SubscriptionsRedirect() {
  const { userType } = useAuth();
  return <Navigate to={userType === 'consumer' ? "/consumer/subscriptions" : "/provider/subscriptions"} replace />;
}

export default App;
