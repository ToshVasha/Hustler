import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Image, Plus, Trash, Edit, Star, Check, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Define types for gallery images
interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  serviceId?: string;
  serviceName?: string;
  uploadDate: string;
  featured: boolean;
  tags: string[];
}

// Mock data for gallery images
const mockGalleryImages: GalleryImage[] = [
  {
    id: "img1",
    url: "/images/placeholders/gallery-placeholder.png",
    alt: "Completed kitchen renovation",
    serviceId: "s2",
    serviceName: "Kitchen Renovation",
    uploadDate: "2025-03-15",
    featured: true,
    tags: ["kitchen", "renovation", "modern"]
  },
  {
    id: "img2",
    url: "/images/placeholders/gallery-placeholder.png",
    alt: "Interior house painting",
    serviceId: "s1",
    serviceName: "House Painting",
    uploadDate: "2025-03-10",
    featured: false,
    tags: ["painting", "interior", "living room"]
  },
  {
    id: "img3",
    url: "/images/placeholders/gallery-placeholder.png",
    alt: "Bathroom remodeling",
    serviceId: "s3",
    serviceName: "Bathroom Remodeling",
    uploadDate: "2025-04-02",
    featured: false,
    tags: ["bathroom", "remodeling", "tile work"]
  },
  {
    id: "img4",
    url: "/images/placeholders/gallery-placeholder.png",
    alt: "Exterior house painting",
    serviceId: "s1",
    serviceName: "House Painting",
    uploadDate: "2025-04-05",
    featured: false,
    tags: ["painting", "exterior"]
  },
  {
    id: "img5",
    url: "/images/placeholders/gallery-placeholder.png",
    alt: "Custom kitchen cabinets",
    serviceId: "s2",
    serviceName: "Kitchen Renovation",
    uploadDate: "2025-03-25",
    featured: true,
    tags: ["kitchen", "cabinets", "custom"]
  },
  {
    id: "img6",
    url: "/images/placeholders/gallery-placeholder.png",
    alt: "Dining room painting",
    serviceId: "s1",
    serviceName: "House Painting",
    uploadDate: "2025-03-18",
    featured: false,
    tags: ["painting", "dining room"]
  },
];

export default function ProviderGalleryManagement() {
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>(mockGalleryImages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string | "all">("all");
  const [editMode, setEditMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Filter images based on search and service
  const filteredImages = images.filter(img => {
    const matchesSearch = searchTerm ? 
      img.alt.toLowerCase().includes(searchTerm.toLowerCase()) || 
      img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) :
      true;
    
    const matchesService = selectedService === "all" || img.serviceId === selectedService;
    
    return matchesSearch && matchesService;
  });

  // Get unique services from images
  const services = Array.from(new Set(images.map(img => img.serviceId)))
    .filter(Boolean)
    .map(id => {
      const img = images.find(img => img.serviceId === id);
      return { id, name: img?.serviceName || "Unknown Service" };
    });

  // Toggle image selection in edit mode
  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imgId => imgId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  // Handle deleting selected images
  const handleDeleteSelected = () => {
    if (selectedImages.length === 0) return;
    
    setImages(images.filter(img => !selectedImages.includes(img.id)));
    toast({
      title: "Images Deleted",
      description: `${selectedImages.length} image(s) have been removed from your gallery`
    });
    setSelectedImages([]);
    setEditMode(false);
  };

  // Toggle featured status of an image
  const toggleFeatured = (id: string) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, featured: !img.featured } : img
    ));
    
    const image = images.find(img => img.id === id);
    toast({
      title: image?.featured ? "Removed from Featured" : "Added to Featured",
      description: `"${image?.alt}" has been ${image?.featured ? 'removed from' : 'added to'} featured images`
    });
  };

  // Handle uploading new images
  const handleUploadImages = () => {
    navigate("/provider/upload-photos");
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/provider/profile')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Gallery Management</h1>
          <div className="mt-2 md:mt-0 flex gap-2">
            {editMode ? (
              <>
                <Button 
                  variant="destructive"
                  disabled={selectedImages.length === 0}
                  onClick={handleDeleteSelected}
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete Selected
                </Button>
                <Button variant="outline" onClick={() => {
                  setEditMode(false);
                  setSelectedImages([]);
                }}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit Gallery
                </Button>
                <Button onClick={handleUploadImages}>
                  <Plus className="h-4 w-4 mr-1" /> Upload Images
                </Button>
              </>
            )}
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search images by description or tags..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="all">All Services</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-4">
          <p className="text-gray-600">{filteredImages.length} images • {images.filter(img => img.featured).length} featured</p>
        </div>
        
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map(image => (
              <div 
                key={image.id} 
                className={`relative aspect-square bg-gray-200 rounded-md overflow-hidden border-2 ${
                  selectedImages.includes(image.id) ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                {image.featured && !editMode && (
                  <Badge className="absolute top-2 left-2 z-10 bg-yellow-500">Featured</Badge>
                )}
                
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                />
                
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${
                  editMode ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                } transition-opacity`}>
                  {editMode ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Button 
                        variant={selectedImages.includes(image.id) ? "default" : "outline"}
                        size="sm"
                        className="text-white"
                        onClick={() => toggleImageSelection(image.id)}
                      >
                        {selectedImages.includes(image.id) ? (
                          <>
                            <Check className="h-4 w-4 mr-1" /> Selected
                          </>
                        ) : (
                          'Select'
                        )}
                      </Button>
                      <Button
                        variant={image.featured ? "default" : "outline"}
                        size="sm"
                        className="text-white"
                        onClick={() => toggleFeatured(image.id)}
                      >
                        <Star className={`h-4 w-4 mr-1 ${image.featured ? 'fill-current' : ''}`} />
                        {image.featured ? 'Featured' : 'Make Featured'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" className="text-white">
                        <Image className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm" className="text-white" onClick={() => toggleFeatured(image.id)}>
                        <Star className={`h-4 w-4 mr-1 ${image.featured ? 'fill-current' : ''}`} />
                        {image.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                  <p className="truncate">{image.alt}</p>
                  <p className="text-xs text-gray-300">{image.serviceName}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No images found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
