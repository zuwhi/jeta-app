"use client";
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript, Libraries } from "@react-google-maps/api";
import { Suspense, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import ButtonBack from "../global_component/button_back";

interface Koordinat {
  lat: number;
  lng: number;
}

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

const MapOne = ({}: {}) => {
  const [mapCenter, setMapCenter] = useState<Koordinat>({
    lat: -6.618650409604555,
    lng: 110.68881761754635,
  });
  const [origin, setOrigin] = useState<Koordinat | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult[]>([]);
  const [listDriver, setListDriver] = useState<DriverResponse[] | null>(null);
  const [isBottomSheetUserOpen, setBottomSheetUserOpen] = useState(false);
  const [driverId, setDriverId] = useState(0);
  const [allDestinations, setAllDestinations] = useState<DestinationType[] | null>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationType[] | null>([]);
  const [directionsFiltered, setDirectionsFiltered] = useState<google.maps.DirectionsResult | null>(null);

  const libraries: Libraries = ["places"];

  useEffect(() => {
    const getAlldestinations = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all_destinations`);
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

    socket.on("connect_error", (err: any) => {
      console.error("Connection error: ", err);
    });
  }, [listDriver]);

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
  const { isLoaded, loadError } = useLoadScript({ id: "google-map-script", googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!, libraries });

  return (
    <Suspense>
      {" "}
      <div className="x relative w-full items-center">
        <div className="z-10 absolute top-2 left-2 ">
          <div className="w-12 h-12 shadow-xl items-center text-3xl rounded-full flex justify-center avatar bg-white">
            <ButtonBack></ButtonBack>
          </div>
        </div>
        <div className="col-span-12 rounded-sm border border-stroke bg-white  shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
          <div className="min-h-screen w-full z-0">
            {isLoaded && (
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
                            position={{
                              lat: Number(split[0]),
                              lng: Number(split[1]),
                            }}
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
                            position={{
                              lat: Number(split[0]),
                              lng: Number(split[1]),
                            }}
                          />
                        );
                      })
                    )}

                {!filteredDestinations?.length
                  ? allDestinations?.map((destination, i) => (
                      <Marker
                        key={i}
                        icon={{ url: "/icons/destination-marker.svg" }}
                        position={{
                          lat: Number(destination.origin.split(",")[0]),
                          lng: Number(destination.origin.split(",")[1]),
                        }}
                      />
                    ))
                  : filteredDestinations?.map((destination, i) => (
                      <Marker
                        key={i}
                        icon={{ url: "/icons/destination-marker.svg" }}
                        position={{
                          lat: Number(destination.origin.split(",")[0]),
                          lng: Number(destination.origin.split(",")[1]),
                        }}
                      />
                    ))}

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
              </GoogleMap>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default MapOne;
