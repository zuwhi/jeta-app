"use client";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useState, useRef, useEffect } from "react";

import Style from "../style/driver.module.css";
import { Profile } from "@/app/type/profile_type";
import axios from "axios";

import Cookies from "js-cookie";
import Image from "next/image";
type Passenger = {
  passenger_id: number;
  lat: number;
  lng: number;
};

interface PassengerResponse {
  email: string;
  firstname: string;
  id: number;
  lastname: string;
  phone_number: string;
  username: string;
}

interface Position {
  top: number;
  left: number;
}

export default function BottomSheet({ nearbyPassengers, isShowRadar, setIsShowRadar }: { nearbyPassengers: Passenger[]; isShowRadar: boolean; setIsShowRadar: (show: boolean) => void }) {
  const ref = useRef<SheetRef>();
  useEffect(() => {
    setIsShowRadar(true);
  }, []);

  const modalRef = useRef<HTMLDialogElement>(null);

  const passengerPositionsRef = useRef<Position[]>([]);

  const [showProfile, setShowProfile] = useState<PassengerResponse | null>(null);

  useEffect(() => {
    if (passengerPositionsRef.current.length === 0 && nearbyPassengers.length > 0) {
      setIsShowRadar(true);
      const generateNonOverlappingPositions = (numPositions: number): Position[] => {
        const positions: Position[] = [];
        const generateRandomPosition = (): Position => ({
          top: Math.random() * 100,
          left: Math.random() * 100,
        });

        while (positions.length < numPositions) {
          const newPosition = generateRandomPosition();
          const isOverlapping = positions.some((position) => Math.abs(position.top - newPosition.top) < 5 && Math.abs(position.left - newPosition.left) < 5);

          if (!isOverlapping) {
            positions.push(newPosition);
          }
        }

        return positions;
      };

      passengerPositionsRef.current = generateNonOverlappingPositions(nearbyPassengers.length);
    }
  }, [nearbyPassengers]);

  const handlePassengerClick = async (passenger: Passenger) => {
    console.log("Clicked passenger:", passenger);
    await getProfileByIdPassenger(passenger.passenger_id);
    modalRef.current?.showModal();
  };

  const getProfileByIdPassenger = async (passengerId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/passenger/${passengerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowProfile(response.data.passenger);
    } catch (error) {
      console.log("Error fetching passenger profile:", error);
    }
  };

  return (
    <>
      <button onClick={() => setIsShowRadar(true)}>Open sheet</button>
      <Sheet ref={ref} isOpen={isShowRadar} onClose={() => setIsShowRadar(false)} snapPoints={[680, 320]} initialSnap={1}>
        <Sheet.Container style={{ zIndex: 10, boxShadow: "0px 0px 8px -2px rgba(0,0,0,0.4)", borderRadius: 27 }}>
          <Sheet.Header className="h-6 z-20" />
          <Sheet.Content>
            <Sheet.Scroller>
              <div className="w-full mt-5 flex justify-center items-center relative">
                <div className="radar mt-10" style={{ zIndex: 1 }}>
                  <div className={Style.outer_circle}>
                    <div className={Style.green_scanner}></div>
                  </div>
                </div>
                {nearbyPassengers.map((passenger, index) => (
                  <button key={index} onClick={() => handlePassengerClick(passenger)}>
                    <div
                      className="passenger m-5 avatar online placeholder "
                      style={{
                        position: "absolute",
                        top: `${passengerPositionsRef.current[index]?.top}%`,
                        left: `${passengerPositionsRef.current[index]?.left}%`,
                        zIndex: 2,
                      }}
                    >
                      <div className="primary text-neutral-content w-12 rounded-full">
                        <span className="text-xl">{passenger.passenger_id}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>

      <dialog id="my_modal_2" className="modal " ref={modalRef}>
        <div className="modal-box w-96 py-8">
          {showProfile ? (
            <div className="flex flex-col items-center">
              <Image className="w-20 mb-3" src="icons/avatar.svg" width={500} height={500} alt="Logo" />
              <div className="my-5 w-full pl-5">
                <p className="text-lg pb-1">
                  Nama : {showProfile.firstname} {showProfile.lastname}
                </p>
                <p className="text-lg pb-1">Email : {showProfile.email}</p> <p className="text-lg pb-1">Telepon : {showProfile.phone_number}</p>{" "}
              </div>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
