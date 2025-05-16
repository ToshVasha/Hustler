import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { JobRequestCard } from "@/components/JobRequestCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "@/components/ui/use-toast";
import { Plus, TrendingUp, Calendar, Users, DollarSign } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Mock data for the calendar and chart
const calendarData = [
  { date: 1, jobs: [] },
  { date: 2, jobs: [] },
  { date: 3, jobs: [] },
  { date: 4, jobs: [] },
  { date: 5, jobs: [] },
  { date: 6, jobs: [] },
  { date: 7, jobs: [{time: "10:00", type: "Wall repair"}] },
  { date: 8, jobs: [] },
  { date: 9, jobs: [] },
  { date: 10, jobs: [] },
  { date: 11, jobs: [] },
  { date: 12, jobs: [] },
  { date: 13, jobs: [] },
  { date: 14, jobs: [] },
  { date: 15, jobs: [] },
  { date: 16, jobs: [] },
  { date: 17, jobs: [] },
  { date: 18, jobs: [] },
  { date: 19, jobs: [{time: "14:30", type: "Wall repair"}] },
  { date: 20, jobs: [] },
  { date: 21, jobs: [] },
  { date: 22, jobs: [] },
  { date: 23, jobs: [] },
  { date: 24, jobs: [] },
  { date: 25, jobs: [] },
  { date: 26, jobs: [] },
  { date: 27, jobs: [] },
  { date: 28, jobs: [{time: "09:30", type: "Apply wallpaper"}] },
  { date: 29, jobs: [] },
  { date: 30, jobs: [] },
];

const earningsData = [
  { name: 'Jan', earnings: 500 },
  { name: 'Feb', earnings: 600 },
  { name: 'Mar', earnings: 800 },
  { name: 'Apr', earnings: 1200 },
  { name: 'May', earnings: 900 },
  { name: 'Jun', earnings: 1500 },
  { name: 'Jul', earnings: 2000 },
  { name: 'Aug', earnings: 1700 },
  { name: 'Sep', earnings: 1400 },
  { name: 'Oct', earnings: 1300 },
  { name: 'Nov', earnings: 1100 },
  { name: 'Dec', earnings: 1000 },
];

// Sample job requests
const jobRequests = [
  {
    id: 'j1',
    jobType: 'Wall repair',
    businessPrice: 80.00,
    customerOffer: 75.00,
    dates: '10/05/2025',
    times: '14:30 onwards',
    comments: 'Wall needs repainting, already fixed the wall, spare Storm by Good Luck',
    image: '/images/services/repair.jpg'
  },
  {
    id: 'j2',
    jobType: 'Apply wallpaper',
    businessPrice: 110.00,
    customerOffer: 110.00,
    dates: '09/05/2025 - 12/05/2025',
    times: '',
    comments: 'approx 25 square meters, wallpaper already purchased and ready to be used',
    image: '/images/services/painting.jpg'
  },
  {
    id: 'j3',
    jobType: 'Wall repair',
    businessPrice: 80.00,
    customerOffer: 80.00,
    dates: '21/05/2025',
    times: '09:00-15:30',
    comments: 'Scrape old wallpaper, needs patch and paint',
    image: '/images/services/repair.jpg'
  }
];

type TimeFilter = 'week' | 'month' | 'quarter' | 'year';

// Custom stats for the dashboard
const statsData = [
  { 
    title: "Monthly Revenue", 
    value: "$2,340", 
    change: "+12.3%", 
    isPositive: true,
    details: "Based on last 30 days of activity" 
  },
  { 
    title: "Completed Jobs", 
    value: "24", 
    change: "+8.1%", 
    isPositive: true,
    details: "9 more than previous period" 
  },
  { 
    title: "Client Retention", 
    value: "78%", 
    change: "-3.2%", 
    isPositive: false,
    details: "Focus on follow-up communications" 
  },
  { 
    title: "Avg. Job Value", 
    value: "$97.50", 
    change: "+5.4%", 
    isPositive: true,
    details: "Higher value services recommended" 
  }
];

const mockServices = [
  {
    id: 's1',
    name: 'House Painting',
    description: 'Professional interior and exterior painting services',
    price: 299,
    category: 'painting',
    image: '/images/services/painting.jpg',
    // ... existing code ...
  },
  {
    id: 's2',
    name: 'Deep Cleaning',
    description: 'Thorough cleaning services for homes and offices',
    price: 199,
    category: 'cleaning',
    image: '/images/services/cleaning.jpg',
    // ... existing code ...
  },
  {
    id: 's3',
    name: 'Plumbing Repair',
    description: 'Expert plumbing services and repairs',
    price: 150,
    category: 'plumbing',
    image: '/images/services/plumbing.jpg',
    // ... existing code ...
  }
];

export default function BusinessDashboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [requests, setRequests] = useState(jobRequests);
  const navigate = useNavigate();
  
  const handleAcceptJob = (jobId: string) => {
    setRequests(prevRequests => prevRequests.filter(req => req.id !== jobId));
    toast({
      title: "Job Accepted",
      description: "Check your calendar for details.",
    });
  };

  const handleDeclineJob = (jobId: string) => {
    setRequests(prevRequests => prevRequests.filter(req => req.id !== jobId));
    toast({
      title: "Job Declined",
      description: "The customer has been notified.",
    });
  };

  const handleAddService = () => {
    navigate('/provider/add-service');
  };

  // Get filtered data based on the selected time filter
  const getFilteredData = () => {
    switch(timeFilter) {
      case 'week':
        // In a real app, filter for weekly data
        return earningsData.slice(-4);
      case 'month':
        return earningsData;
      case 'quarter':
        // In a real app, group data by quarters
        return earningsData;
      case 'year':
        // In a real app, get yearly data
        return earningsData;
      default:
        return earningsData;
    }
  };

  // Format dollar values
  const formatDollar = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto px-4 pb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Business Dashboard</h1>
          <Button onClick={handleAddService} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Service
          </Button>
        </div>
        
        {/* Quick Stats Section */}
        <section className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                    <div className="flex items-baseline mt-1">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className={`ml-2 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {stat.details}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Job Requests Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Job Requests</h2>
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((job) => (
                  <JobRequestCard
                    key={job.id}
                    jobType={job.jobType}
                    businessPrice={job.businessPrice}
                    customerOffer={job.customerOffer}
                    dates={job.dates}
                    times={job.times}
                    comments={job.comments}
                    image={job.image}
                    onAccept={() => handleAcceptJob(job.id)}
                    onDecline={() => handleDeclineJob(job.id)}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">No pending job requests</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
          
          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">March 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-2">
                <div className="text-center text-sm font-medium">Sun</div>
                <div className="text-center text-sm font-medium">Mon</div>
                <div className="text-center text-sm font-medium">Tue</div>
                <div className="text-center text-sm font-medium">Wed</div>
                <div className="text-center text-sm font-medium">Thu</div>
                <div className="text-center text-sm font-medium">Fri</div>
                <div className="text-center text-sm font-medium">Sat</div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {calendarData.map((day, index) => (
                  <div 
                    key={index}
                    className={`border rounded-md p-2 h-24 overflow-y-auto ${
                      day.jobs.length > 0 ? 'bg-hustlr-light-purple/30' : ''
                    }`}
                  >
                    <div className="text-right text-sm">{day.date}</div>
                    {day.jobs.map((job, jobIndex) => (
                      <div key={jobIndex} className="mt-1 p-1 bg-hustlr-purple text-white rounded text-xs">
                        <div>{job.time}</div>
                        <div className="truncate">{job.type}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Earnings Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Earnings Summary</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={timeFilter === 'week' ? 'default' : 'outline'} 
                  onClick={() => setTimeFilter('week')}
                >
                  By Week
                </Button>
                <Button 
                  size="sm" 
                  variant={timeFilter === 'month' ? 'default' : 'outline'} 
                  onClick={() => setTimeFilter('month')}
                >
                  By Month
                </Button>
                <Button 
                  size="sm" 
                  variant={timeFilter === 'quarter' ? 'default' : 'outline'} 
                  onClick={() => setTimeFilter('quarter')}
                >
                  By Quarter
                </Button>
                <Button 
                  size="sm" 
                  variant={timeFilter === 'year' ? 'default' : 'outline'} 
                  onClick={() => setTimeFilter('year')}
                >
                  By Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getFilteredData()}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => formatDollar(value)}
                      labelFormatter={(label) => `Period: ${label}`} 
                      contentStyle={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#8B5CF6" 
                      fill="#D6BCFA" 
                      name="Earnings" 
                      activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: 'white' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
