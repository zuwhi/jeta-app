
// "use client";
// import React, { createContext, useContext, useState } from "react";

// interface MapContextProps {
//   center: { lat: number; lng: number };
//   zoom: number;
//   setCenter: (center: { lat: number; lng: number }) => void;
//   setZoom: (zoom: number) => void;
// }

// const MapContext = createContext<MapContextProps | undefined>(undefined);

// export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [center, setCenter] = useState({ lat: -6.2, lng: 106.816666 });
//   const [zoom, setZoom] = useState(12);

//   return <MapContext.Provider value={{ center, setCenter, zoom, setZoom }}>{children}</MapContext.Provider>;
// };

// export const useMap = () => {
//   const context = useContext(MapContext);
//   if (!context) {
//     throw new Error("useMap must be used within a MapProvider");
//   }
//   return context;
// };
