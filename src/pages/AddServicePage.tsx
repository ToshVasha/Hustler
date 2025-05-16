import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useService } from "@/contexts/ServiceContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const serviceCategories = [
  { value: "painting", label: "Painting" },
  { value: "cleaning", label: "Cleaning" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "repair", label: "Repair" },
  { value: "art", label: "Art & Design" },
  { value: "other", label: "Other" }
];

export default function AddServicePage() {
  const { user } = useAuth();
  const { addService } = useService();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [priceType, setPriceType] = useState<"hour" | "job">("hour");
  const [category, setCategory] = useState("painting");
  
  // Features for the service
  const [features, setFeatures] = useState<string[]>([""]);
  
  // Add a new empty feature input
  const addFeature = () => {
    setFeatures([...features, ""]);
  };
  
  // Update a feature at a specific index
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  
  // Remove a feature at a specific index
  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
    }
  };
  
  // Handle service creation
  const handleCreateService = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a service.",
        variant: "destructive"
      });
      return;
    }
    
    if (!name || !description || price <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Filter out empty features
    const validFeatures = features.filter(feature => feature.trim() !== "");
    
    const newService = addService({
      name,
      description,
      price,
      priceType,
      imageUrl: `/images/services/${category}.jpg`,
      providerId: user.id,
      category
    });
    
    navigate("/provider/dashboard");
  };
  
  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create New Service</h1>
          <Button onClick={() => navigate("/provider/dashboard")} variant="outline">
            Cancel
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Service Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Professional House Painting"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your service in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        min={1}
                        step={1}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="priceType">Price Type</Label>
                      <Select 
                        value={priceType} 
                        onValueChange={(value) => setPriceType(value as "hour" | "job")}
                      >
                        <SelectTrigger id="priceType">
                          <SelectValue placeholder="Select price type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hour">Per Hour</SelectItem>
                          <SelectItem value="job">Per Job</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Service Features */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Service Features</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <Input
                        placeholder={`Feature ${index + 1}, e.g., "Eco-friendly paints"`}
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-grow"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeFeature(index)}
                        disabled={features.length <= 1}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={addFeature}
                  >
                    Add Another Feature
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview Card */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Service Preview</h3>
                <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {name || "Service Name"}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-hustlr-purple font-medium">
                        {price > 0 ? `$${price} / ${priceType === "hour" ? "hour" : "job"}` : "Price not set"}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                      {description || "Service description will appear here..."}
                    </p>
                    {features.some(f => f.trim() !== "") && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Features:</p>
                        <ul className="list-disc text-sm pl-5 mt-1 text-gray-600">
                          {features.map((feature, idx) => 
                            feature.trim() !== "" ? (
                              <li key={idx}>{feature}</li>
                            ) : null
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleCreateService} 
              className="w-full" 
              size="lg"
            >
              Create Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
