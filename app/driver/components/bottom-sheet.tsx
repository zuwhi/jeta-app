"use client";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useState, useRef, useEffect } from "react";

import Style from "../style/driver.module.css";

type Passenger = {
  passenger_id: number;
  lat: number;
  lng: number;
};

interface Position {
  top: number;
  left: number;
}

export default function BottomSheet({ nearbyPassengers, isShowRadar, setIsShowRadar }: { nearbyPassengers: Passenger[], isShowRadar: boolean, setIsShowRadar: (show: boolean) => void }) {
 
  const ref = useRef<SheetRef>();
  useEffect(() => {
    setIsShowRadar(true);
  }, []);

  const passengerPositionsRef = useRef<Position[]>([]);

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
                  <div
                    key={index}
                    className="passenger m-5 avatar online placeholder"
                    style={{
                      position: "absolute",
                      top: `${passengerPositionsRef.current[index]?.top}%`,
                      left: `${passengerPositionsRef.current[index]?.left}%`,
                      zIndex: 2,
                    }}
                  >
                    <div className="primary text-neutral-content w-12 rounded-full">
                      <span className="text-xl"> {passenger.passenger_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        {/* <Sheet.Backdrop /> */}
      </Sheet>
    </>
  );
}
