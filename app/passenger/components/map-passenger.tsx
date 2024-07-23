import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useProfile } from "@/app/provider/auth_provider";
import BottomSheetUser from "./bottom-sheet-user";
import { Koordinat } from "@/app/type/koordinat_type";
import socket from "@/app/socket/socket";

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

const colorMap: { [key: number]: string } = {};

const getColorForDriver = (driverId: number) => {
  if (!colorMap[driverId]) {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colorMap[driverId] = color;
  }
  return colorMap[driverId];
};

const MapDirection = ({
  searchCenter,
  handleDestinationRecomendation,
  isFilteredEmpty,
  isCanFocusMap,
}: {
  searchCenter: Koordinat | null;
  handleDestinationRecomendation: (data: DestinationType) => void;
  isFilteredEmpty: boolean;
  isCanFocusMap: boolean;
}) => {
  const { profile } = useProfile();
  const [mapCenter, setMapCenter] = useState<Koordinat>({ lat: -6.618650409604555, lng: 110.68881761754635 });
  const [origin, setOrigin] = useState<Koordinat | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult[]>([]);
  const [listDriver, setListDriver] = useState<DriverResponse[] | null>(null);
  const [isBottomSheetUserOpen, setBottomSheetUserOpen] = useState(false);
  const [driverId, setDriverId] = useState(0);
  const [allDestinations, setAllDestinations] = useState<DestinationType[] | null>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationType[] | null>([]);
  const [directionsFiltered, setDirectionsFiltered] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (searchCenter && allDestinations && !isFilteredEmpty) {
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
        handleDestinationRecomendation(closestDestination);
      } else {
        setFilteredDestinations([]);
      }
    }
  }, [searchCenter, allDestinations, isFilteredEmpty]);

  useEffect(() => {
    if (isFilteredEmpty) {
      setFilteredDestinations([]);
    }
  }, [isFilteredEmpty]);

  useEffect(() => {
    const getAlldestinations = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/all_destinations`);
        setAllDestinations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getAlldestinations();
  }, []);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, { transports: ["websocket"] });

    socket.on("connect", () => {
      socket.emit("requestAllDriverLocations", {});

      socket.on("allDriverLocations", (listDriver: DriverResponse[]) => {
        console.log("listDriver =", listDriver);
        setListDriver(listDriver);
        // console.log("listDriver =", listDriver);
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server.");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error: ", err);
    });
  }, [listDriver]);

  useEffect(() => {
    isCanFocusMap && setMapCenter(origin || { lat: -6.618650409604555, lng: 110.68881761754635 });
    if (navigator.geolocation && profile) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng = { lat: latitude, lng: longitude };
          setOrigin(userLatLng);

          socket.emit("passengerLocationUpdate", {
            passenger_id: profile?.id,
            lat: userLatLng.lat,
            lng: userLatLng.lng,
          });
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
  }, [origin, isCanFocusMap]);

  const getDistance = ({ lat1, lon1, lat2, lon2 }: { lat1: number; lon1: number; lat2: number; lon2: number }) => {
    const R = 6371;
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
            result.routes.forEach((route) => {
              (route as any).driverId = driver_id;
            });
            setDirections((prev) => [...prev, result]);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  const calculateRouteFiltered = (origin: string, destinations: string[], driver_id: number) => {
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
            setDirectionsFiltered(result);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (allDestinations && (!filteredDestinations || filteredDestinations.length === 0)) {
      allDestinations.forEach((destination) => {
        calculateRoute(destination.origin, destination.destinations, destination.driver_id);
      });
    }
  }, [allDestinations, filteredDestinations]);

  useEffect(() => {
    if (filteredDestinations && filteredDestinations.length > 0) {
      const { origin, destinations, driver_id } = filteredDestinations[0];
      calculateRouteFiltered(origin, destinations, driver_id);
    }
  }, [filteredDestinations]);

  return (
    <div className="min-h-screen w-full z-0">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        center={mapCenter}
        zoom={16}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: "greedy",
          fullscreenControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ visibility: "simplified" }],
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {origin && <Marker position={origin} icon={{ url: "/icons/passenger.svg" }} />}

        {listDriver?.map((data) => (
          <Marker
            key={data.driver_id}
            position={data.origin}
            icon={{ url: "/icons/buss.svg" }}
            onClick={() => {
              setBottomSheetUserOpen(true);
              setDriverId(data.driver_id);
            }}
          />
        ))}

        {!filteredDestinations?.length
          ? allDestinations?.map((destination, i) =>
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
            )
          : filteredDestinations?.map((destination, i) =>
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

        {!filteredDestinations?.length
          ? allDestinations?.map((destination, i) => <Marker key={i} icon={{ url: "/icons/destination-marker.svg" }} position={{ lat: Number(destination.origin.split(",")[0]), lng: Number(destination.origin.split(",")[1]) }} />)
          : filteredDestinations?.map((destination, i) => <Marker key={i} icon={{ url: "/icons/destination-marker.svg" }} position={{ lat: Number(destination.origin.split(",")[0]), lng: Number(destination.origin.split(",")[1]) }} />)}

        {!filteredDestinations?.length
          ? directions.map((direction, index) => (
              <DirectionsRenderer
                key={index}
                options={{
                  polylineOptions: {
                    strokeColor: getColorForDriver((direction.routes[0] as any).driverId),
                    strokeOpacity: 0.4,
                    strokeWeight: 5,
                  },
                  markerOptions: { opacity: 0 },
                }}
                directions={direction}
              />
            ))
          : directionsFiltered && (
              <DirectionsRenderer
                directions={directionsFiltered}
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
      </GoogleMap>
    </div>
  );
};

export default MapDirection;
