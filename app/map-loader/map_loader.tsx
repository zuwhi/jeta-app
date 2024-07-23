import React from "react";
import { useLoadScript, GoogleMap, Libraries, LoadScript } from "@react-google-maps/api";

const libraries: Libraries = ["places"];



interface MapLoaderProps {
  center: { lat: number; lng: number };
  children: React.ReactNode;
  containerStyle: React.CSSProperties;
  zoom: number
}

const MapLoader: React.FC<MapLoaderProps> = ({ center, children,zoom, containerStyle= { width: "100%", height: "100vh" } }) => {
  const { isLoaded, loadError } = useLoadScript({ id: "google-map-script", googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!, libraries });

  // if (loadError) {
  //   return <div>Error loading maps</div>;
  // }

  // if (!isLoaded) {
  //   return <div>Loading Maps</div>;
  // }

  return (
    <div className="min-h-screen w-full z-0">
      {/* <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY!} libraries={libraries} > */}{
       isLoaded && <div className="min-h-screen w-full z-0">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              gestureHandling: "greedy",
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
            {children}
          </GoogleMap>
        </div>}
      {/* </LoadScript> */}
    </div>
  );
};

export default MapLoader;
