import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Libraries } from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import { useProfile } from "@/app/provider/auth_provider";
import MapLoader from "@/app/map-loader/map_loader";
import socket from "@/app/socket/socket";

interface Koordinat {
  lat: number;
  lng: number;
}
const libraries: Libraries = ["places"];

// Function to calculate the distance between two coordinates in meters
const getDistance = (coord1: Koordinat, coord2: Koordinat) => {
  const R = 6371e3; // Radius of the Earth in meters
  const lat1 = coord1.lat * (Math.PI / 180);
  const lat2 = coord2.lat * (Math.PI / 180);
  const deltaLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const deltaLng = (coord2.lng - coord1.lng) * (Math.PI / 180);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const MapDirection = ({ setNearbyPassengers ,isCanFocusMap, isStopShareLocation}: {setNearbyPassengers: any, isCanFocusMap: boolean, isStopShareLocation: boolean}) => {
  const router = useRouter();
  const { profile } = useProfile();

  // if (!profile) {
  //   router.push("/login");
  // }
  const [mapCenter, setMapCenter] = useState<Koordinat>({ lat: -6.618650409604555, lng: 110.68881761754635 });
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState<Koordinat | null>(null);
  const [destination, setDestination] = useState<Koordinat[]>([]);
  const [directions, setDirections] = useState<any>(null);
  const [listPassenger, setListPassenger] = useState<any[]>([]);

  const params = useSearchParams();

  useEffect(() => {
    const search = params.get("coordinates");
    const coordinatesArray = search?.split(";").filter((coord) => coord.trim().length > 0);
    if (coordinatesArray && coordinatesArray.length > 0) {
      const destinations = coordinatesArray.map((coordStr) => {
        const [lat, lng] = coordStr.split(",").map((str) => parseFloat(str.trim()));
        return { lat, lng };
      });

      setDestination(destinations);
    }
  }, [params]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, { transports: ["websocket"] });

    socket.on("connect", () => {
      socket.emit("requestAllPassengerLocations", {});

      socket.on("allPassengerLocations", (passenger) => {
        console.log("Received data: ", passenger);
        setListPassenger(passenger);
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server.");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error: ", err);
    });

  
    return () => {
      socket.disconnect();
    };
  }, [listPassenger]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLatLng = { lat: latitude, lng: longitude };
        setOrigin(userLatLng);
        const data = {
          driver_id: profile?.id || 0,
          origin: userLatLng,
          heading: 90,
        };
        console.log("Data to be sent to backend:", data);

       isStopShareLocation ? socket.emit("locationUpdate", data) : null;
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
  }, [profile]);

  useEffect(() => {
    isCanFocusMap && setMapCenter(origin || { lat: -6.618650409604555, lng: 110.68881761754635 });
    if (origin && destination.length > 0 && window.google) {
      const waypoints = destination.map((dest) => ({ location: dest }));
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          waypoints,
          destination: destination[destination.length - 1],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`, result);
          }
        }
      );
    }
  }, [origin, destination]);

  useEffect(() => {
    if (origin) {
      const nearby = listPassenger.filter((passenger) => {
        const passengerCoords = { lat: passenger.lat, lng: passenger.lng };
        const distance = getDistance(origin, passengerCoords);
        return distance <= 500;
      });

      setNearbyPassengers(nearby);
    }
  }, [origin, listPassenger]);

  return (
    <MapLoader zoom={20} center={mapCenter} containerStyle={{ width: "100%", height: "100vh" }}>
      <div className="min-h-screen w-full z-0">
        {origin && (
          <Marker
            position={origin}
            icon={{
              url: "/icons/buss.svg",
            }}
          />
        )}

        {destination.map((dest, index) => (
          <Marker
            key={index}
            position={dest}
            label={{
              text: `${index + 1}`,
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          />
        ))}

        {listPassenger.map((passenger: any, index: any) => (
          <Marker
            key={index}
            position={{ lat: passenger.lat, lng: passenger.lng }}
            icon={{
              url: "/icons/passenger.svg",
            }}
          />
        ))}

        {directions && (
          <DirectionsRenderer
            options={{
              polylineOptions: {
                strokeColor: "orange",
                strokeOpacity: 0.5,
                strokeWeight: 4,
              },
              markerOptions: {
                opacity: 0,
              },
              // draggable: true,
              preserveViewport: true,
              // draggable: true, // Ensure directions are draggable
            }}
            directions={directions}
          />
        )}
      </div>
    </MapLoader>
  );
};

export default MapDirection;
