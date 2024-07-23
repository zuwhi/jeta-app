"use client";
import React, { RefObject, Suspense, useEffect, useRef, useState } from "react";
import BottomSheet from "./components/bottom-sheet";
// import { useRouter, useSearchParams } from "next/navigation";
import MapDirection from "./components/map-driver";
import ButtonBack from "../global_component/button_back";
import Image from "next/image";

const MapDriver = () => {
  // const router = useRouter();
  const [isCanFocusMap, setIsCanFocusMap] = useState(false);
  const [isShowRadar, setIsShowRadar] = useState(false);
  const [isStopShareLocation, setIsStopShareLocation] = useState(true);
  const [nearbyPassengers, setNearbyPassengers] = useState<any[]>([]);
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const handleClickOnFocusMap = () => {
    setIsCanFocusMap(!isCanFocusMap);
  };

  const handleClickOnRadar = () => {
    setIsShowRadar(!isShowRadar);
  };
  const showModalHandle = () => {
    modalRef.current?.showModal();
    // setIsStopShareLocation(!isStopShareLocation);
  };
  const handleStopShareLocation = () => {
    // modalRef.current?.showModal();
    setIsStopShareLocation(false);
  };
  const handleShareLocation = () => {
    // modalRef.current?.showModal();
    setIsStopShareLocation(true);
  };

  return (
    <Suspense>
      <div className="x relative flex-col flex min-h-screen w-full items-center">
        <MapDirection setNearbyPassengers={setNearbyPassengers} isCanFocusMap={isCanFocusMap} isStopShareLocation={isStopShareLocation} />
        <div className="z-10 absolute bottom-0 left-0 w-full">
          <BottomSheet isShowRadar={isShowRadar} setIsShowRadar={setIsShowRadar} nearbyPassengers={nearbyPassengers} />
        </div>
        <div className="focus z-10 absolute top-[35%] right-2 transform -translate-y-1/2 flex flex-col">
          <div className="w-11 h-11  shadow items-center text-3xl rounded-sm flex justify-center bg-white">
            <button onClick={() => showModalHandle()} className=" ">
              {isStopShareLocation ? <Image src="icons/stop.svg" className="w-7" width={500} height={500} alt="Focus" /> : <Image src="icons/share.svg" className="w-7" width={500} height={500} alt="Focus" />}
            </button>
          </div>

          <div className="w-11 h-11 mt-5 shadow items-center text-3xl rounded-sm flex justify-center bg-white op">
            <button onClick={() => handleClickOnRadar()} className=" ">
              <Image src="icons/radar.svg" className={`w-8 ${isShowRadar ? "opacity-100" : "opacity-50"}`} width={500} height={500} alt="Focus" />
            </button>
          </div>
          <div className="w-11 h-11 mt-5 shadow items-center text-3xl rounded-sm flex justify-center bg-white">
            <button onClick={() => handleClickOnFocusMap()} className=" ">
              {isCanFocusMap ? <Image src="icons/focus.svg" className="w-7" width={500} height={500} alt="Focus" /> : <Image src="icons/unfocus.svg" className="w-7" width={500} height={500} alt="Focus" />}
            </button>
          </div>
        </div>
        <div className="z-10 absolute top-2 left-2 ">
          <div className="w-12 h-12 shadow-xl items-center text-3xl rounded-full flex justify-center avatar bg-white">
            <ButtonBack></ButtonBack>
          </div>
        </div>
      </div>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box ">
          <div className="w-full flex flex-col items-center ">
            <Image className="rounded h-full w-52" src="story/bus-driver.svg" width={500} height={500} alt="a" />
            <h3 className="font-medium text-center text-lg">
              Apakah kakmu yakin ingin <br /> {isStopShareLocation ? "berhenti" : ""} membagikan lokasi ?
            </h3>
          </div>

          <div className="modal-action flex gap-2 justify-center w-full ">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn w-36">Tidak</button>
            </form>
            <button
              onClick={() => {
                isStopShareLocation ? handleStopShareLocation() : handleShareLocation();
              }}
              className="btn w-36 text-white primary"
            >
              Iya
            </button>
          </div>
        </div>
      </dialog>
    </Suspense>
  );
};

export default MapDriver;
