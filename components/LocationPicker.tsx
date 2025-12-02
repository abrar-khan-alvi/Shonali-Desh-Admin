import React, { useState } from 'react';
import Map from './Map';

interface LocationPickerProps {
    onLocationChange: (lat: number, lon: number) => void;
    initialLat?: number;
    initialLon?: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
    onLocationChange,
    initialLat = 23.8103,
    initialLon = 90.4125,
}) => {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number }>({
        lat: initialLat,
        lon: initialLon,
    });

    const handleLocationSelect = (lat: number, lon: number) => {
        setSelectedLocation({ lat, lon });
        onLocationChange(lat, lon);
    };

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Field Location
                </label>
                <p className="text-xs text-gray-500 mb-2">
                    Click on the map to select the field location
                </p>
                <Map
                    center={selectedLocation}
                    zoom={13}
                    height="350px"
                    interactive={true}
                    onLocationSelect={handleLocationSelect}
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Selected Location</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-gray-600">Latitude:</span>
                        <p className="font-mono text-blue-700">
                            {selectedLocation.lat.toFixed(6)}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-600">Longitude:</span>
                        <p className="font-mono text-blue-700">
                            {selectedLocation.lon.toFixed(6)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
