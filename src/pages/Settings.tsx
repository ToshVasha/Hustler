
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, userType, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();
  
  const handleSaveChanges = () => {
    toast.success("Settings saved successfully!");
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logged out successfully");
  };
  
  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto px-4 pb-10">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <nav className="space-y-1">
                  <Button 
                    variant={activeTab === "account" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("account")}
                  >
                    Account Details
                  </Button>
                  <Button 
                    variant={activeTab === "password" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("password")}
                  >
                    Password & Security
                  </Button>
                  
                  {userType === 'business' && (
                    <>
                      <Button 
                        variant={activeTab === "services" ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => setActiveTab("services")}
                      >
                        Add Service
                      </Button>
                      <Button 
                        variant={activeTab === "history" ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => setActiveTab("history")}
                      >
                        Business History
                      </Button>
                    </>
                  )}
                  
                  {userType === 'consumer' && (
                    <>
                      <Button 
                        variant={activeTab === "subscription" ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => setActiveTab("subscription")}
                      >
                        Manage Subscription
                      </Button>
                      <Button 
                        variant={activeTab === "jobhistory" ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => setActiveTab("jobhistory")}
                      >
                        Job History
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    variant={activeTab === "support" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("support")}
                  >
                    Support & FAQs
                  </Button>
                  
                  {/* Logout button */}
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start mt-4"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Right content area */}
          <div className="md:col-span-3">
            <Card>
              {activeTab === "account" && (
                <>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input defaultValue={user?.name || ""} className="mt-1" />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Account Type</label>
                        <Input defaultValue={userType || ""} disabled className="mt-1 bg-gray-100" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Date of Birth</label>
                      <Input type="date" className="mt-1" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <Input className="mt-1" placeholder="Enter your address" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <Input className="mt-1" defaultValue={user?.email?.split('@')[0] || ""} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Mobile Number</label>
                      <Input className="mt-1" type="tel" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input className="mt-1" type="email" defaultValue={user?.email || ""} />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </div>
                  </CardContent>
                </>
              )}
              
              {activeTab === "password" && (
                <>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>Manage your password and security options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Current Password</label>
                      <Input type="password" className="mt-1" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">New Password</label>
                      <Input type="password" className="mt-1" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input type="password" className="mt-1" />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveChanges}>Update Password</Button>
                    </div>
                  </CardContent>
                </>
              )}
              
              {activeTab === "services" && userType === 'business' && (
                <>
                  <CardHeader>
                    <CardTitle>Add Service</CardTitle>
                    <CardDescription>Add a new service to your profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Service Title</label>
                      <Input className="mt-1" placeholder="Enter the service title here" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Service Type</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a service type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="painting">Painting</SelectItem>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="gardening">Gardening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Service Description</label>
                      <Textarea 
                        className="mt-1" 
                        placeholder="Enter a brief description of the service here"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <Input 
                        type="number" 
                        className="mt-1" 
                        placeholder="Enter the service price" 
                        min="0" 
                        step="0.01"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveChanges}>Create Job</Button>
                    </div>
                  </CardContent>
                </>
              )}
              
              {activeTab === "history" && userType === 'business' && (
                <>
                  <CardHeader>
                    <CardTitle>Business History</CardTitle>
                    <CardDescription>View past jobs and account milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-500">Job history will appear here</p>
                    </div>
                  </CardContent>
                </>
              )}
              
              {activeTab === "subscription" && userType === 'consumer' && (
                <>
                  <CardHeader>
                    <CardTitle>Manage Subscription</CardTitle>
                    <CardDescription>Join our premium subscription for cheaper rates!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-hustlr-light-purple/20 border border-hustlr-purple rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-2">Premium Subscription</h3>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center">
                          <span className="text-hustlr-purple mr-2">✓</span>
                          Priority booking with service providers
                        </li>
                        <li className="flex items-center">
                          <span className="text-hustlr-purple mr-2">✓</span>
                          10% discount on all service fees
                        </li>
                        <li className="flex items-center">
                          <span className="text-hustlr-purple mr-2">✓</span>
                          Extended customer support
                        </li>
                        <li className="flex items-center">
                          <span className="text-hustlr-purple mr-2">✓</span>
                          Exclusive access to top-rated providers
                        </li>
                      </ul>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2">$9.99<span className="text-sm font-normal">/month</span></div>
                        <Button className="w-full md:w-auto">Subscribe Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
              
              {activeTab === "jobhistory" && userType === 'consumer' && (
                <>
                  <CardHeader>
                    <CardTitle>Job History</CardTitle>
                    <CardDescription>View past jobs you have requested</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-500">Job history will appear here</p>
                    </div>
                  </CardContent>
                </>
              )}
              
              {activeTab === "support" && (
                <>
                  <CardHeader>
                    <CardTitle>Support & FAQs</CardTitle>
                    <CardDescription>Contact our 24/7 support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input className="mt-1" placeholder="What can we help you with?" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea 
                        className="mt-1" 
                        placeholder="Describe your issue in detail"
                        rows={6}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={() => toast.success("Support request sent! We'll get back to you soon.")}>
                        Submit Request
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
