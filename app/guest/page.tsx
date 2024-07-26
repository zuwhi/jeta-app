"use client";
import React, { RefObject, useRef, useState } from "react";

import MapDirection from "./components/map-guest";
import { useRouter } from "next/navigation";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import Image from "next/image";
import MapLoader from "../map-loader/map_loader";
import ButtonBack from "../global_component/button_back";

const MapPassenger = () => {
  const router = useRouter();

  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isCanFocusMap, setIsCanFocusMap] = useState(false);

  const [isFilteredEmpty, setIsFilteredEmpty] = useState(false);
  const handleClickOnFocusMap = () => {
    setIsCanFocusMap(!isCanFocusMap);
  };

  const handleBackClick = () => {
    router.push("/allow-location");
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  return (
    <div className="x relative flex-col flex min-h-screen w-full items-center">
      <MapLoader containerStyle={{ width: "100%", height: "100vh" }} center={{ lat: -6.618650409604555, lng: 110.68881761754635 }} zoom={10}>
        <div className="z-10 absolute top-2 left-2 ">
          <div className="w-12 h-12 shadow-xl items-center text-3xl rounded-full flex justify-center avatar bg-white">
            <ButtonBack></ButtonBack>
          </div>
        </div>
        <div className="focus z-10 absolute bottom-[5%] right-3 transform -translate-y-1/2 flex flex-col">
          <div className="w-11 h-11 mt-5 shadow items-center text-3xl rounded-sm flex justify-center bg-white">
            <button onClick={() => handleClickOnFocusMap()} className=" ">
              {isCanFocusMap ? <Image src="icons/focus.svg" className="w-7" width={500} height={500} alt="Focus" /> : <Image src="icons/unfocus.svg" className="w-7" width={500} height={500} alt="Focus" />}
            </button>
          </div>
        </div>
        <MapDirection isCanFocusMap={isCanFocusMap} />
        <div className="z-10 absolute bottom-0 left-0 w-full"></div>
      </MapLoader>
    </div>
  );
};

export default MapPassenger;
