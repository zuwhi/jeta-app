import { GoogleMap, Marker, DirectionsRenderer, Libraries } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Koordinat } from "@/app/type/koordinat_type";
import BottomSheetUser from "./bottom-sheet-user";
import socket from "@/app/socket/socket";
import axios from "axios";
import { useProfile } from "@/app/provider/auth_provider";
import { ruteDriver } from "@/app/data/rute_driver";
interface DriverResponse {
  driver_id: number;
  heading: number;
  origin: Origin;
}

interface Origin {
  lat: number;
  lng: number;
}

interface DestinationType {
  destinations: string[];
  driver_id: number;
  origin: string;
}

const MapDirection = ({ searchCenter }: { searchCenter: Koordinat | null }) => {
  const { profile } = useProfile();
  const [mapCenter, setMapCenter] = useState<Koordinat>({ lat: -6.618650409604555, lng: 110.68881761754635 });
  const [origin, setOrigin] = useState<Koordinat | null>(null);
  const [isBottomSheetUserOpen, setBottomSheetUserOpen] = useState(false);
  const [driverId, setDriverId] = useState(0);
  const [allDestinations, setAllDestinations] = useState<DestinationType[] | null>([]);
  const [isMapCentered, setIsMapCentered] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationType[] | null>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (searchCenter && allDestinations) {
      let closestDestination = null;
      let minDistance = Infinity;

      allDestinations.forEach((destinationObj) => {
        destinationObj.destinations.forEach((destination) => {
          const destCoords = destination.split(",").map(Number);
          console.log("Destination:", destination);

          const distance = getDistance({
            lat1: searchCenter.lat,
            lon1: searchCenter.lng,
            lat2: destCoords[0],
            lon2: destCoords[1],
          });

          console.log("Calculated distance:", distance);

          if (distance < minDistance) {
            console.log("New closest destination found with distance", distance);

            minDistance = distance;
            closestDestination = destinationObj;
          }
        });
      });

      if (closestDestination) {
        console.log("Final closest destination:", closestDestination);
        setFilteredDestinations([closestDestination]);
      } else {
        setFilteredDestinations([]);
      }
    }
  }, [searchCenter, allDestinations]);

  useEffect(() => {
    const getAlldestinations = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/all_destinations`);
        setAllDestinations(response.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    getAlldestinations();
  }, []);

  useEffect(() => {
    if (navigator.geolocation && profile) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng = { lat: latitude, lng: longitude };
          setOrigin(userLatLng);
          console.log("Origin:", userLatLng);

          if (!isMapCentered) {
            setMapCenter(userLatLng);
            setIsMapCentered(true);
          }
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
    }
  }, [origin, isMapCentered]);

  const getDistance: any = ({ lat1, lon1, lat2, lon2 }: { lat1: number; lon1: number; lat2: number; lon2: number }) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = 0.5 - Math.cos(dLat) / 2 + (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2;
    return R * 2 * Math.asin(Math.sqrt(a)) * 1000; // distance in meters
  };

  const calculateRoute = (origin: string, destinations: string[], driver_id: number) => {
    if (destinations.length !== 0) {
      const directionsService = new google.maps.DirectionsService();

      const waypoints = destinations.slice(1, destinations.length - 1).map((dest) => ({
        location: dest,
        stopover: true,
      }));

      directionsService.route(
        {
          origin: origin,
          destination: destinations[destinations.length - 1],
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (filteredDestinations && filteredDestinations.length > 0) {
      const { origin, destinations, driver_id } = filteredDestinations[0];
      calculateRoute(origin, destinations, driver_id);
    }
  }, [filteredDestinations]);

  return (
    <div className="min-h-screen w-full z-0">
      {origin && <Marker position={origin} icon={{ url: "/icons/passenger.svg" }} />}
      {filteredDestinations?.map((destination, i) =>
        destination.destinations.map((dest, index) => {
          const split = dest.split(",");
          return (
            <Marker
              key={index}
              label={{
                text: `${i + 1}`,
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
              }}
              position={{ lat: Number(split[0]), lng: Number(split[1]) }}
            />
          );
        })
      )}
      {filteredDestinations?.map((destination, i) => (
        <Marker key={i} icon={{ url: "/icons/destination-marker.svg" }} position={{ lat: Number(destination.origin.split(",")[0]), lng: Number(destination.origin.split(",")[1]) }} />
      ))}
      {directions && (
        <DirectionsRenderer
          directions={directions}
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
        />
      )}
      {isBottomSheetUserOpen && <BottomSheetUser driverId={driverId} isBottomSheetUserOpen={isBottomSheetUserOpen} setBottomSheetUserOpen={setBottomSheetUserOpen} />}
    </div>
  );
};

export default MapDirection;
