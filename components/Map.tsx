import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
// Using CDN URLs instead of importing files to avoid TypeScript errors
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
});

export interface MapMarker {
    lat: number;
    lon: number;
    popup?: string;
    title?: string;
}

interface MapProps {
    center?: { lat: number; lon: number };
    zoom?: number;
    markers?: MapMarker[];
    height?: string;
    onLocationSelect?: (lat: number, lon: number) => void;
    interactive?: boolean;
}

const Map: React.FC<MapProps> = ({
    center = { lat: 23.8103, lon: 90.4125 }, // Default to Bangladesh center
    zoom = 7,
    markers = [],
    height = '400px',
    onLocationSelect,
    interactive = false,
}) => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const currentMarkerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map
        const map = L.map(mapContainerRef.current).setView([center.lat, center.lon], zoom);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        // Add click handler for interactive mode
        if (interactive && onLocationSelect) {
            map.on('click', (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;

                // Remove previous marker if exists
                if (currentMarkerRef.current) {
                    map.removeLayer(currentMarkerRef.current);
                }

                // Add new marker
                const marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup(`Selected Location<br>Lat: ${lat.toFixed(6)}<br>Lon: ${lng.toFixed(6)}`).openPopup();
                currentMarkerRef.current = marker;

                // Call callback
                onLocationSelect(lat, lng);
            });
        }

        // Cleanup
        return () => {
            map.remove();
        };
    }, [center.lat, center.lon, zoom, interactive, onLocationSelect]);

    // Update markers when they change
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        // Clear existing markers (except the current selection marker in interactive mode)
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker && layer !== currentMarkerRef.current) {
                map.removeLayer(layer);
            }
        });

        // Add new markers
        markers.forEach((markerData) => {
            const marker = L.marker([markerData.lat, markerData.lon]).addTo(map);

            if (markerData.popup) {
                marker.bindPopup(markerData.popup);
            }

            if (markerData.title) {
                marker.bindTooltip(markerData.title);
            }
        });

        // Fit bounds if multiple markers
        if (markers.length > 1) {
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lon]));
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (markers.length === 1) {
            map.setView([markers[0].lat, markers[0].lon], 13);
        }
    }, [markers]);

    return (
        <div
            ref={mapContainerRef}
            style={{ height, width: '100%', borderRadius: '8px', zIndex: 1 }}
            className="border border-gray-300"
        />
    );
};

export default Map;
