
import { useState, useEffect } from 'react';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  price: number;
}

interface MapViewProps {
  markers: MapMarker[];
  onMarkerClick: (markerId: string) => void;
}

export function MapView({ markers, onMarkerClick }: MapViewProps) {
  // In a real app, this would use a mapping library like Google Maps or Mapbox
  // For now, we'll create a visual representation of a map
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMarker) {
      onMarkerClick(selectedMarker);
    }
  }, [selectedMarker, onMarkerClick]);

  return (
    <div className="relative h-[300px] w-full bg-[#e2e8f0] rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=600x300&maptype=roadmap&key=DEMO_KEY')] bg-cover opacity-50">
        {/* This is a placeholder image. In a real app, replace with actual map */}
      </div>
      
      <div className="relative z-10 h-full">
        {markers.map((marker) => (
          <div
            key={marker.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              selectedMarker === marker.id ? 'z-20 scale-125' : 'z-10'
            }`}
            style={{
              left: `${(marker.lng + 180) * (100 / 360)}%`,
              top: `${(90 - marker.lat) * (100 / 180)}%`
            }}
            onClick={() => setSelectedMarker(marker.id)}
          >
            <div className="bg-hustlr-purple text-white rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-xs font-bold">H</span>
            </div>
            
            {selectedMarker === marker.id && (
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg w-48">
                <h3 className="font-medium text-sm">{marker.name}</h3>
                <p className="text-xs text-gray-600">${marker.price} inc. fees</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
