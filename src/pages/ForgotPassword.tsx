
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      toast.success(`Verification code sent to ${email}. Use 123456 for demo.`);
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp !== "123456") {
      toast.error("Invalid verification code. Try 123456 for demo.");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("reset");
      toast.success("OTP verified successfully. Please reset your password.");
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password reset successful! You can now login with your new password.");
      // In a real app, redirect to login page
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hustlr-light-gray p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-hustlr-purple flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>
            {step === "email" && "Enter your email to receive a verification code"}
            {step === "otp" && "Enter the verification code sent to your email"}
            {step === "reset" && "Create a new password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <Input
                    id="email"
                    placeholder="Enter your email address..."
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-center text-sm text-gray-500 mb-4">
                We've sent a 6-digit verification code to <span className="font-medium">{email}</span>
              </p>
              <div className="flex justify-center mb-4">
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
              <Button type="submit" className="w-full" disabled={isLoading || otp.length < 6}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setStep("email")} 
                  className="text-hustlr-purple text-sm hover:underline"
                >
                  Change email address
                </button>
              </div>
              <div className="text-center mt-2">
                <button 
                  type="button" 
                  className="text-hustlr-purple text-sm hover:underline"
                  onClick={() => {
                    toast.info("Resending code...");
                    setTimeout(() => {
                      toast.success(`New verification code sent to ${email}. Use 123456 for demo.`);
                    }, 1000);
                  }}
                >
                  Didn't receive a code? Resend
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Demo code: 123456
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  placeholder="Create a new password..."
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="confirmPassword"
                  placeholder="Confirm new password..."
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-hustlr-purple text-sm flex items-center gap-1 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
