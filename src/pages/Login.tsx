import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Facebook, Mail, Phone } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"consumer" | "business">("consumer");
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "social">("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const { login, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userType === "business") {
        navigate("/provider/dashboard");
      } else {
        navigate("/consumer/dashboard");
      }
    }
  }, [isAuthenticated, userType, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let emailToUse = username;
      let passwordToUse = password;
      
      // If empty, use demo accounts
      if (!username && authMethod === "email") {
        emailToUse = loginType === "consumer" ? "consumer@example.com" : "business@example.com";
        passwordToUse = "password";
      }
      
      // Handle different authentication methods
      let success = false;
      
      if (authMethod === "email") {
        login(emailToUse, passwordToUse);
        success = true; // Assume success for demo purposes
      } else if (authMethod === "phone" && showOTP) {
        // Simulate OTP verification (in a real app, this would verify with a backend)
        success = otp === "123456";
        if (success) {
          // Simulate login with a generated email based on phone number
          login(`${phoneNumber.replace(/\D/g, '')}@phone.user`, "phoneverified");
        } else {
          toast.error("Invalid OTP code. Try 123456 for demo purposes.");
        }
      } else if (authMethod === "social") {
        // Simulate social login
        login(loginType === "consumer" ? "social.consumer@example.com" : "social.business@example.com", "socialauth");
        success = true; // Assume success for demo purposes
        if (success) {
          toast.success("Successfully authenticated with social login");
        }
      }

      if (success) {
        // Redirect based on user type
        if (loginType === "business") {
          navigate("/provider/dashboard");
        } else {
          navigate("/consumer/dashboard");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: "consumer" | "business") => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Use the demo account credentials
      const email = type === "consumer" ? "consumer@example.com" : "business@example.com";
      login(email, "password");
      
      // Redirect to appropriate dashboard
      navigate(type === "consumer" ? "/consumer/dashboard" : "/provider/dashboard");
      
      toast.success(`Logged in as ${type === "consumer" ? "Consumer" : "Provider"} Demo Account`);
      setIsLoading(false);
    }, 500); // Small delay for better UX
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setShowOTP(true);
    toast.success(`OTP sent to ${phoneNumber}. Use code 123456 for demo.`);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setAuthMethod("social");
    
    // Simulate social login delay
    setTimeout(() => {
      handleLogin(new Event('submit') as unknown as React.FormEvent);
    }, 1000);
    
    toast.info(`Authenticating with ${provider}...`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hustlr-light-gray p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-hustlr-purple flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Hustlr</CardTitle>
          <CardDescription>Login to connect with service providers</CardDescription>
          
          {/* Demo Account Quick Access Buttons */}
          <div className="flex flex-col mt-4 space-y-2">
            <div className="text-sm font-medium text-gray-500 mb-1">Quick Demo Access:</div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleDemoLogin("consumer")}
                variant="outline" 
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                disabled={isLoading}
              >
                <span role="img" aria-label="consumer" className="mr-2">👤</span> 
                Consumer Demo
              </Button>
              <Button 
                onClick={() => handleDemoLogin("business")}
                variant="outline" 
                className="bg-green-50 hover:bg-green-100 border-green-200"
                disabled={isLoading}
              >
                <span role="img" aria-label="provider" className="mr-2">🧑‍🔧</span> 
                Provider Demo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "consumer" | "business")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="consumer">Consumer Login</TabsTrigger>
              <TabsTrigger value="business">Business Login</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as "email" | "phone" | "social")} className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                <span>Social</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="username"
                    placeholder={`Enter your ${loginType === "consumer" ? "consumer" : "business"} email... (or leave empty for demo)`}
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    placeholder="Enter your password... (or leave empty for demo)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : `Login as ${loginType === "consumer" ? "Consumer" : "Business"}`}
                </Button>
                
                {loginType === "consumer" && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Demo account: consumer@example.com / password123
                  </div>
                )}
                
                {loginType === "business" && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Demo account: business@example.com / password123
                  </div>
                )}
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              {!showOTP ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="phone"
                      placeholder="Enter your phone number..."
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-center mb-2">Enter the 6-digit code sent to {phoneNumber}</p>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || otp.length < 6}>
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => setShowOTP(false)} 
                      className="text-hustlr-purple text-sm hover:underline"
                    >
                      Change phone number
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Demo OTP: 123456
                  </div>
                </form>
              )}
            </TabsContent>
            
            <TabsContent value="social">
              <div className="space-y-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center gap-2" 
                  onClick={() => handleSocialLogin('Meta')}
                  disabled={isLoading}
                >
                  <Facebook className="h-4 w-4" />
                  <span>Continue with Meta</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200" 
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54L20.0303 3.12C17.9503 1.19 15.2353 0 12.0003 0C7.31033 0 3.25533 2.69 1.28033 6.60L5.27033 9.71C6.23533 6.86 8.87033 4.75 12.0003 4.75Z"
                    />
                    <path
                      fill="#34A853"
                      d="M23.49 12.27C23.49 11.48 23.41 10.73 23.27 10H12V14.51H18.47C18.22 15.99 17.41 17.25 16.2 18.1L20.1 21.1C22.33 19.01 23.49 15.92 23.49 12.27Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.26999 14.29C5.02999 13.57 4.89999 12.8 4.89999 12C4.89999 11.2 5.02999 10.43 5.26999 9.71L1.28999 6.6C0.47999 8.23 0 10.06 0 12C0 13.94 0.47999 15.77 1.28999 17.4L5.26999 14.29Z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12.0004 24C15.2404 24 17.9604 22.92 20.1004 21.1L16.2004 18.1C15.1404 18.8 13.7404 19.25 12.0004 19.25C8.87043 19.25 6.23543 17.14 5.27043 14.29L1.28043 17.4C3.25543 21.31 7.31043 24 12.0004 24Z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="relative w-full mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
          <div className="text-center text-sm w-full">
            <div className="mb-2">
              No account? <Link to="/signup" className="text-hustlr-purple hover:underline">Create one</Link>
            </div>
            <Link to="/forgot-password" className="text-hustlr-purple hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
