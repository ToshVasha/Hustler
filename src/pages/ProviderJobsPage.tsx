
import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Grid, List, Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock jobs data
const MOCK_JOBS = [
  {
    id: "job1",
    title: "Kitchen Repainting",
    category: "painting",
    description: "Need professional painter to repaint kitchen cabinets and walls. White color, approximately 200 sq ft.",
    budget: { min: 200, max: 300 },
    location: "San Francisco, CA",
    postedDate: "2025-05-09T10:30:00",
    consumerName: "Sandra East",
    consumerId: "c456",
    status: "open",
    type: "one-time"
  },
  {
    id: "job2",
    title: "Weekly House Cleaning",
    category: "cleaning",
    description: "Looking for a regular house cleaner for a 2000 sq ft home. Weekly service needed.",
    budget: { min: 80, max: 120 },
    location: "Oakland, CA",
    postedDate: "2025-05-10T14:15:00",
    consumerName: "Michael West",
    consumerId: "c457",
    status: "open",
    type: "recurring"
  },
  {
    id: "job3",
    title: "Bathroom Plumbing Repair",
    category: "plumbing",
    description: "Leaking sink and shower need repair. Urgent service required.",
    budget: { min: 150, max: 250 },
    location: "Berkeley, CA",
    postedDate: "2025-05-11T09:45:00",
    consumerName: "Julia South",
    consumerId: "c459",
    status: "open",
    type: "one-time"
  },
  {
    id: "job4",
    title: "Office Electrical Wiring",
    category: "electrical",
    description: "Need to install new outlets and fix lighting in small office space.",
    budget: { min: 300, max: 500 },
    location: "San Francisco, CA",
    postedDate: "2025-05-08T11:20:00",
    consumerName: "Robert North",
    consumerId: "c460",
    status: "open",
    type: "one-time"
  },
  {
    id: "job5",
    title: "Monthly Garden Maintenance",
    category: "landscaping",
    description: "Regular garden maintenance for front and backyard, including mowing, trimming and weeding.",
    budget: { min: 100, max: 150 },
    location: "Palo Alto, CA",
    postedDate: "2025-05-07T16:10:00",
    consumerName: "Emma East",
    consumerId: "c461",
    status: "open",
    type: "recurring"
  }
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "painting", label: "Painting" },
  { value: "cleaning", label: "Cleaning" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "landscaping", label: "Landscaping" },
  { value: "it", label: "IT Services" },
  { value: "legal", label: "Legal Services" }
];

type ViewMode = "grid" | "list";

export default function ProviderJobsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [budgetRange, setBudgetRange] = useState([0, 500]);
  const [locationFilter, setLocationFilter] = useState("any");
  
  // Filter jobs
  const filteredJobs = MOCK_JOBS.filter(job => {
    // Filter by search term
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    
    // Filter by job type
    const matchesType = jobTypeFilter === "all" || job.type === jobTypeFilter;
    
    // Filter by budget range
    const matchesBudget = job.budget.min <= budgetRange[1] && job.budget.max >= budgetRange[0];
    
    // Filter by location (simplified for demo)
    const matchesLocation = locationFilter === "any" || job.location.includes(locationFilter);
    
    return matchesSearch && matchesCategory && matchesType && matchesBudget && matchesLocation;
  });
  
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Posted just now';
    } else if (diffInHours < 24) {
      return `Posted ${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Posted ${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };
  
  const handleViewJobDetails = (jobId: string) => {
    navigate(`/provider/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Find Available Jobs</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search jobs by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg py-6"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="one-time">One-time Jobs</SelectItem>
                    <SelectItem value="recurring">Recurring Jobs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                    <SelectItem value="Oakland">Oakland</SelectItem>
                    <SelectItem value="Berkeley">Berkeley</SelectItem>
                    <SelectItem value="Palo Alto">Palo Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <Select defaultValue="newest">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="budget-high">Highest Budget</SelectItem>
                    <SelectItem value="budget-low">Lowest Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Budget Range: ${budgetRange[0]} - ${budgetRange[1]}
                </label>
              </div>
              <Slider
                defaultValue={[0, 500]}
                max={500}
                step={10}
                value={budgetRange}
                onValueChange={setBudgetRange}
                className="py-4"
              />
            </div>
            
            <div className="flex justify-end">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                  className={`rounded-none ${viewMode === "grid" ? "" : "border-0"}`}
                  size="sm"
                >
                  <Grid size={16} className="mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  className={`rounded-none ${viewMode === "list" ? "" : "border-0"}`}
                  size="sm"
                >
                  <List size={16} className="mr-1" />
                  List
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">{filteredJobs.length} jobs found</p>
            
            {filteredJobs.length > 0 ? (
              <div className={`space-y-4`}>
                {filteredJobs.map(job => (
                  <Card key={job.id} className={`overflow-hidden ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                    <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-grow' : ''}`}>
                      <div className={viewMode === 'list' ? 'grid md:grid-cols-3 gap-4' : ''}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            <Badge variant={job.type === "recurring" ? "outline" : "secondary"}>
                              {job.type === "recurring" ? "Recurring" : "One-time"}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 line-clamp-2">{job.description}</p>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            {job.location}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 items-center text-sm">
                            <Badge variant="outline" className="flex items-center">
                              <DollarSign size={14} className="mr-1" />
                              ${job.budget.min} - ${job.budget.max}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50">
                              {categories.find(c => c.value === job.category)?.label || job.category}
                            </Badge>
                          </div>
                        </div>
                        
                        {viewMode === 'list' && (
                          <div className="flex flex-col justify-between">
                            <div className="text-sm text-gray-500">
                              <p>Posted by: {job.consumerName}</p>
                              <p>{getRelativeTime(job.postedDate)}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className={`mt-4 ${viewMode === 'list' ? 'md:mt-0 flex items-center justify-center' : ''}`}>
                          <Button 
                            onClick={() => handleViewJobDetails(job.id)}
                            className="w-full bg-hustlr-purple hover:bg-hustlr-purple/90"
                          >
                            View Details & Apply
                          </Button>
                        </div>
                      </div>
                      
                      {viewMode === 'grid' && (
                        <div className="mt-4 text-sm text-gray-500">
                          <p>{getRelativeTime(job.postedDate)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No jobs found matching your criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
