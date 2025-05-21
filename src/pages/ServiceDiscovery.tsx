
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceCard } from "@/components/ServiceCard";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useService } from "@/contexts/ServiceContext";

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

export default function ServiceDiscovery() {
  const navigate = useNavigate();
  const { services } = useService();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [ratingFilter, setRatingFilter] = useState("any");
  const [availabilityFilter, setAvailabilityFilter] = useState("any");

  // Filter and sort services
  const filteredServices = services.filter(service => {
    // Filter by search term
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    
    // Filter by price range
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    
    // Filter by rating
    let matchesRating = true;
    if (ratingFilter === "5") {
      matchesRating = service.rating === 5;
    } else if (ratingFilter === "4") {
      matchesRating = service.rating >= 4;
    } else if (ratingFilter === "3") {
      matchesRating = service.rating >= 3;
    }
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Service Discovery</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search services by keyword..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Rating</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Availability</SelectItem>
                    <SelectItem value="today">Available Today</SelectItem>
                    <SelectItem value="this-week">Available This Week</SelectItem>
                    <SelectItem value="next-week">Available Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select defaultValue="any">
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="nearby">Nearby</SelectItem>
                    <SelectItem value="5km">Within 5km</SelectItem>
                    <SelectItem value="10km">Within 10km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
              </div>
              <Slider
                defaultValue={[0, 300]}
                max={300}
                step={5}
                value={priceRange}
                onValueChange={setPriceRange}
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
            <p className="text-sm text-gray-500 mb-4">{filteredServices.length} results found</p>
            
            {filteredServices.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {filteredServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    name={service.name}
                    price={service.price}
                    rating={service.rating}
                    experience={`Rating: ${service.rating}/5`}
                    customerSatisfaction={`${service.reviewCount} reviews`}
                    description={service.description}
                    image={service.imageUrl}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No services found matching your criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
