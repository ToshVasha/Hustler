
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { UserType } from "@/contexts/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("consumer");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { signup, isAuthenticated, userType: authUserType } = useAuth();
  const navigate = useNavigate();
  const { toast: useToastHook } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (authUserType === "business") {
        navigate("/provider/dashboard");
      } else {
        navigate("/consumer/dashboard");
      }
    }
  }, [isAuthenticated, authUserType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword || !phone || !city || !state) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError(null);
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      let userData: any = {
        name,
        email,
        password,
        type: userType,
        phone,
        location: city + ", " + state
      };

      if (userType === "business") {
        userData = {
          ...userData,
          yearsInBusiness,
          description
        };
      }
      
      signup(userData);
      
      // Redirect based on user type
      if (userType === "business") {
        navigate("/provider/dashboard");
      } else {
        navigate("/consumer/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account.");
    }
  };
  
  const handleDemoAccount = (type: UserType) => {
    let userData: any = {
      name: type === "consumer" ? "Demo Consumer" : "Demo Business",
      email: type === "consumer" ? "demo.consumer@example.com" : "demo.business@example.com",
      password: "password123",
      type,
      phone: "555-123-4567",
      location: "San Francisco, CA"
    };
    
    if (type === "business") {
      userData = {
        ...userData,
        yearsInBusiness: 5,
        description: "Demo business account for testing purposes."
      };
    }
    
    signup(userData);
    toast.success(`Created demo ${type} account!`);
    
    // Redirect based on user type
    if (type === "business") {
      navigate("/provider/dashboard");
    } else {
      navigate("/consumer/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hustlr-light-gray p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-hustlr-purple flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join our community of service providers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={userType} onValueChange={(value) => setUserType(value as UserType)} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="consumer">Consumer Account</TabsTrigger>
              <TabsTrigger value="business">Business Account</TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="Enter your full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="confirm-password"
                placeholder="Confirm your password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">
                  <AlertCircle className="inline-block h-4 w-4 mr-1 align-middle" />
                  {passwordError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                id="phone"
                placeholder="Enter your phone number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="space-y-2 w-1/2">
                <Input
                  id="city"
                  placeholder="City"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2 w-1/2">
                <Input
                  id="state"
                  placeholder="State"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
            {userType === "business" && (
              <>
                <div className="space-y-2">
                  <Input
                    id="years-in-business"
                    placeholder="Years in business"
                    type="number"
                    value={yearsInBusiness}
                    onChange={(e) => setYearsInBusiness(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    id="description"
                    placeholder="Describe your business"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full">
              Create {userType === "consumer" ? "Consumer" : "Business"} Account
            </Button>
          </form>
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
              Already have an account? <Link to="/login" className="text-hustlr-purple hover:underline">Login</Link>
            </div>
            <div className="flex justify-center gap-4">
              <button 
                type="button" 
                onClick={() => handleDemoAccount("consumer")} 
                className="text-hustlr-purple hover:underline"
              >
                Demo Consumer
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoAccount("business")} 
                className="text-hustlr-purple hover:underline"
              >
                Demo Business
              </button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
