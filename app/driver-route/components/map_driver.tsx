import React, { useEffect, useState, useCallback } from "react";
import { Marker, DirectionsRenderer } from "@react-google-maps/api";
import MapLoader from "@/app/map-loader/map_loader";

interface Koordinat {
  lat: number;
  lng: number;
}

interface MapDriverProps {
  listDirection: string[];
  setOriginDriver: any;
}

const MapDriver: React.FC<MapDriverProps> = ({ listDirection, setOriginDriver }) => {
  const [mapCenter, setMapCenter] = useState<Koordinat>({ lat: -6.618650409604555, lng: 110.68881761754635 });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [origin, setOrigin] = useState<Koordinat | null>(null);

  const calculateRoute = useCallback((origin: Koordinat, destination: Koordinat, waypoints: google.maps.DirectionsWaypoint[]) => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log("Directions result:", result);
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status, result);
        }
      }
    );
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLatLng = { lat: latitude, lng: longitude };
        setOrigin(userLatLng);
        setOriginDriver("" + userLatLng.lat + "," + userLatLng.lng);
        setMapCenter(userLatLng);
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (origin && listDirection.length > 0) {
      const updatedListDirection = [
        origin,
        ...listDirection.map((value) => {
          const [lat, lng] = value.split(",").map(parseFloat);
          return { lat, lng };
        }),
      ];

      const waypoints = updatedListDirection.slice(1, -1).map((value) => ({
        location: value,
      }));

      const destination = updatedListDirection[updatedListDirection.length - 1];

      // console.log("Calculating route from:", origin, "to:", destination, "via waypoints:", waypoints);
      calculateRoute(origin, destination, waypoints);
    }
  }, [origin, listDirection, calculateRoute]);

  return (
    <div className="w-full h-72">
      <MapLoader zoom={15} containerStyle={{ width: "100%", height: "60vh" }} center={mapCenter}>
        {origin && (
          <Marker
            position={origin}
            icon={{
              url: "/icons/bus-marker.svg",
            }}
          />
        )}
        {listDirection.map((value, index) => {
          const [lat, lng] = value.split(",").map(parseFloat);
          return (
            <Marker
              key={index}
              position={{ lat, lng }}
              label={{
                text: `${index + 2}`,
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            />
          );
        })}
        {directions && (
          <DirectionsRenderer
            options={{
              polylineOptions: {
                strokeColor: "orange",
                strokeOpacity: 0.8,
                strokeWeight: 6,
              },
              markerOptions: {
                opacity: 0,
              },
            }}
            directions={directions}
          />
        )}
      </MapLoader>
    </div>
  );
};

export default MapDriver;
