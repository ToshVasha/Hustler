import { useState } from "react";
import { Bell, User, Settings, Home, MessageSquare, DollarSign, Search, Briefcase, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export function AppHeader() {
  const { user, logout, userType, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  
  const [notifications] = useState([
    { id: 1, message: "New job request received", time: "5 min ago", isRead: false },
    { id: 2, message: "Appointment confirmed for tomorrow", time: "1 hour ago", isRead: false },
    { id: 3, message: "New review received", time: "2 hours ago", isRead: true },
  ]);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (userType === 'business') {
        navigate(`/provider/jobs?q=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/consumer/discover?q=${encodeURIComponent(searchQuery)}`);
      }
    } else {
      if (userType === 'business') {
        navigate('/provider/jobs');
      } else {
        navigate('/consumer/discover');
      }
    }
  };
  
  const handleReadNotification = (id: number) => {
    // In a real app, this would update the notification status in the backend
    toast.success("Notification marked as read");
    setShowNotificationMenu(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logged out successfully");
  };

  const switchToConsumerDemo = () => {
    logout();
    login("consumer@example.com", "password");
    navigate('/consumer/dashboard');
    toast.success("Switched to Consumer Demo");
  };

  const switchToBusinessDemo = () => {
    logout();
    login("business@example.com", "password");
    navigate('/provider/dashboard');
    toast.success("Switched to Provider Demo");
  };

  // Define base paths for user types
  const basePath = userType === 'business' ? '/provider' : '/consumer';
  
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center mb-6 shadow-sm">
      <div className="flex items-center">
        <Link to={userType === 'business' ? "/provider/dashboard" : "/consumer/dashboard"} className="text-2xl font-bold text-hustlr-purple flex items-center">
          <div className="w-10 h-10 bg-hustlr-purple rounded-full flex items-center justify-center mr-2">
            <span className="text-white font-bold">H</span>
          </div>
          Hustlr
        </Link>
        
        <form onSubmit={handleSearch} className="ml-6 hidden md:flex">
          <div className="relative flex items-center">
            <Input
              placeholder={userType === 'business' ? "Search jobs..." : "Search services..."}
              className="w-64 pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 text-gray-400" size={16} />
            <Button type="submit" variant="ghost" className="ml-2">
              Search
            </Button>
          </div>
        </form>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <Link to={`${basePath}/dashboard`} className="text-gray-600 hover:text-hustlr-purple">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center">
            <Home size={18} className="mr-1" />
            <span className="hidden lg:inline">Dashboard</span>
          </Button>
        </Link>
        
        {userType === 'business' ? (
          <>
            <Link to={`${basePath}/messages`} className="text-gray-600 hover:text-hustlr-purple">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center">
                <MessageSquare size={18} className="mr-1" />
                <span className="hidden lg:inline">Messages</span>
              </Button>
            </Link>
            <Link to={`${basePath}/jobs`} className="text-gray-600 hover:text-hustlr-purple">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center">
                <Briefcase size={18} className="mr-1" />
                <span className="hidden lg:inline">Find Jobs</span>
              </Button>
            </Link>
          </>
        ) : (
          <Link to={`${basePath}/messages`} className="text-gray-600 hover:text-hustlr-purple">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center">
              <MessageSquare size={18} className="mr-1" />
              <span className="hidden lg:inline">Messages</span>
            </Button>
          </Link>
        )}
        
        {userType === 'business' && (
          <Link to={`${basePath}/profile`} className="text-gray-600 hover:text-hustlr-purple">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center">
              <DollarSign size={18} className="mr-1" />
              <span className="hidden lg:inline">Earnings</span>
            </Button>
          </Link>
        )}
        
        <Link to={`${basePath}/settings`} className="text-gray-600 hover:text-hustlr-purple">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center">
            <Settings size={18} className="mr-1" />
            <span className="hidden lg:inline">Settings</span>
          </Button>
        </Link>
        
        <div className="relative">
          <Link to={`${basePath}/notifications`}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-500">{userType === 'business' ? 'Provider Account' : 'Consumer Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`${basePath}/profile`} className="w-full">
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${basePath}/settings`} className="w-full">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${basePath}/notifications`} className="w-full">Notifications</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Switch Demo Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={switchToConsumerDemo} className="cursor-pointer">
              👤 Switch to Consumer Demo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={switchToBusinessDemo} className="cursor-pointer">
              🧑‍🔧 Switch to Provider Demo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut size={16} className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
