import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Service, useService } from "@/contexts/ServiceContext";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
}

const defaultImages = [
  "/images/services/painting.jpg",
  "/images/services/cleaning.jpg",
  "/images/services/plumbing.jpg",
  "/images/services/electrical.jpg"
];

export function ServiceDialog({ open, onOpenChange, service }: ServiceDialogProps) {
  const { user } = useAuth();
  const { addService, updateService } = useService();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [priceType, setPriceType] = useState<"hour" | "job">("hour");
  const [imageUrl, setImageUrl] = useState("/images/services/painting.jpg");
  const [category, setCategory] = useState("painting");
  
  // Initialize form when service changes
  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setPrice(service.price);
      setPriceType(service.priceType);
      setImageUrl(service.imageUrl);
      setCategory(service.category);
    } else {
      // Default values for new service
      setName("");
      setDescription("");
      setPrice(0);
      setPriceType("hour");
      setImageUrl("/images/services/painting.jpg");
      setCategory("painting");
    }
  }, [service]);

  const handleSave = () => {
    if (!user || !name || !description || price <= 0) {
      return;
    }
    
    if (service) {
      // Update existing service
      updateService(service.id, {
        name,
        description,
        price,
        priceType,
        imageUrl,
        category
      });
    } else {
      // Create new service
      addService({
        name,
        description,
        price,
        priceType,
        imageUrl,
        providerId: user.id,
        category
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {service 
              ? "Update your service details below."
              : "Fill out the form to add a new service."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Service Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. House Painting"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe your service..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                type="number" 
                value={price.toString()} 
                onChange={(e) => setPrice(Number(e.target.value))} 
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priceType">Price Type</Label>
              <Select value={priceType} onValueChange={(value) => setPriceType(value as "hour" | "job")}>
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
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="art">Art & Design</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="image">Image URL</Label>
            <div className="grid grid-cols-4 gap-2">
              <div className={`border p-2 rounded cursor-pointer ${imageUrl === "/images/services/painting.jpg" ? "ring-2 ring-hustlr-purple" : ""}`} onClick={() => setImageUrl("/images/services/painting.jpg")}>
                <img src="/images/services/painting.jpg" alt="Painting Service" className="w-full h-16 object-cover rounded" />
              </div>
              <div className={`border p-2 rounded cursor-pointer ${imageUrl === "/images/services/cleaning.jpg" ? "ring-2 ring-hustlr-purple" : ""}`} onClick={() => setImageUrl("/images/services/cleaning.jpg")}>
                <img src="/images/services/cleaning.jpg" alt="Cleaning Service" className="w-full h-16 object-cover rounded" />
              </div>
              <div className={`border p-2 rounded cursor-pointer ${imageUrl === "/images/services/plumbing.jpg" ? "ring-2 ring-hustlr-purple" : ""}`} onClick={() => setImageUrl("/images/services/plumbing.jpg")}>
                <img src="/images/services/plumbing.jpg" alt="Plumbing Service" className="w-full h-16 object-cover rounded" />
              </div>
              <div className={`border p-2 rounded cursor-pointer ${imageUrl === "/images/services/electrical.jpg" ? "ring-2 ring-hustlr-purple" : ""}`} onClick={() => setImageUrl("/images/services/electrical.jpg")}>
                <img src="/images/services/electrical.jpg" alt="Electrical Service" className="w-full h-16 object-cover rounded" />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{service ? "Update Service" : "Add Service"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
