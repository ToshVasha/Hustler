
import { useState, ChangeEvent } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Upload, X, Image as ImageIcon, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Define types for services
interface Service {
  id: string;
  name: string;
}

// Define types for photo upload
interface UploadPhoto {
  id: string;
  file: File;
  preview: string;
  caption: string;
  serviceId?: string;
  tags: string[];
  featured: boolean;
}

// Mock services data
const mockServices: Service[] = [
  { id: "s1", name: "House Painting" },
  { id: "s2", name: "Kitchen Renovation" },
  { id: "s3", name: "Bathroom Remodeling" }
];

export default function ProviderPhotoUpload() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<UploadPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentTag, setCurrentTag] = useState("");

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    const newPhotos = selectedFiles.map(file => ({
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      tags: [],
      featured: false
    }));
    
    setPhotos([...photos, ...newPhotos]);
  };

  // Handle removing a photo
  const handleRemovePhoto = (id: string) => {
    const photoToRemove = photos.find(p => p.id === id);
    if (photoToRemove?.preview) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    setPhotos(photos.filter(p => p.id !== id));
  };

  // Handle setting caption for a photo
  const handleSetCaption = (id: string, caption: string) => {
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, caption } : p
    ));
  };

  // Handle setting service for a photo
  const handleSetService = (id: string, serviceId: string) => {
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, serviceId } : p
    ));
  };

  // Handle adding a tag for a photo
  const handleAddTag = (id: string) => {
    if (!currentTag.trim()) return;
    
    setPhotos(photos.map(p => 
      p.id === id ? { 
        ...p, 
        tags: [...p.tags.filter(tag => tag !== currentTag.trim().toLowerCase()), currentTag.trim().toLowerCase()]
      } : p
    ));
    
    setCurrentTag("");
  };

  // Handle removing a tag for a photo
  const handleRemoveTag = (photoId: string, tag: string) => {
    setPhotos(photos.map(p => 
      p.id === photoId ? { ...p, tags: p.tags.filter(t => t !== tag) } : p
    ));
  };

  // Handle toggling featured status for a photo
  const handleToggleFeatured = (id: string) => {
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    ));
  };

  // Handle photo upload
  const handleUpload = async () => {
    // Validate photos have required information
    const incompletePhotos = photos.filter(p => !p.caption || !p.serviceId);
    if (incompletePhotos.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please add caption and select a service for all photos",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Upload Successful",
        description: `${photos.length} photos have been added to your gallery`
      });
      navigate("/provider/gallery-management");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/provider/gallery-management')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Upload Photos</h1>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center p-8 border-2 border-dashed rounded-md">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="text-lg font-medium mt-2">Drag and drop your photos here</h2>
              <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Button asChild className="mt-4">
                <Label htmlFor="photo-upload">Select Photos</Label>
              </Button>
            </div>
            
            {photos.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Selected Photos ({photos.length})</h3>
                
                <div className="space-y-6">
                  {photos.map(photo => (
                    <div key={photo.id} className="border rounded-md overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-64 relative">
                          <img 
                            src={photo.preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                            onClick={() => handleRemovePhoto(photo.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className={`absolute bottom-2 right-2 ${photo.featured ? 'bg-yellow-100' : ''}`}
                            onClick={() => handleToggleFeatured(photo.id)}
                          >
                            <Star className={`h-4 w-4 ${photo.featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            {photo.featured ? 'Featured' : 'Set as Featured'}
                          </Button>
                        </div>
                        
                        <div className="md:w-2/3 p-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor={`caption-${photo.id}`}>Caption or Description *</Label>
                              <Textarea
                                id={`caption-${photo.id}`}
                                placeholder="Describe this photo..."
                                value={photo.caption}
                                onChange={(e) => handleSetCaption(photo.id, e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`service-${photo.id}`}>Related Service *</Label>
                              <select
                                id={`service-${photo.id}`}
                                className="w-full p-2 border rounded-md"
                                value={photo.serviceId || ""}
                                onChange={(e) => handleSetService(photo.id, e.target.value)}
                              >
                                <option value="">Select a service</option>
                                {mockServices.map(service => (
                                  <option key={service.id} value={service.id}>
                                    {service.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <Label htmlFor={`tags-${photo.id}`}>Tags</Label>
                              <div className="flex items-center">
                                <Input
                                  id={`tags-${photo.id}`}
                                  placeholder="Add tags..."
                                  value={currentTag}
                                  onChange={(e) => setCurrentTag(e.target.value)}
                                  className="flex-1"
                                />
                                <Button 
                                  type="button" 
                                  onClick={() => handleAddTag(photo.id)}
                                  disabled={!currentTag.trim()}
                                  className="ml-2"
                                >
                                  Add
                                </Button>
                              </div>
                              
                              {photo.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {photo.tags.map(tag => (
                                    <span 
                                      key={tag} 
                                      className="bg-gray-100 px-2 py-1 rounded-md flex items-center text-sm"
                                    >
                                      {tag}
                                      <button 
                                        type="button" 
                                        onClick={() => handleRemoveTag(photo.id, tag)}
                                        className="ml-1 text-gray-500 hover:text-gray-700"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/provider/gallery-management")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload} 
                    disabled={photos.length === 0 || uploading}
                    className="bg-hustlr-purple hover:bg-hustlr-purple/90"
                  >
                    {uploading ? 'Uploading...' : 'Upload Photos'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-blue-800 font-medium">Tips for Great Photos</h3>
          <ul className="text-sm text-blue-700 mt-2 list-disc pl-5 space-y-1">
            <li>Use good lighting to highlight your work</li>
            <li>Take photos from multiple angles</li>
            <li>Make sure the subject is clear and in focus</li>
            <li>Include before and after shots when possible</li>
            <li>Higher quality photos attract more clients</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
