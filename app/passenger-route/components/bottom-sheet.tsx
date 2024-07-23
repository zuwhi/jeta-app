"use client";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function BottomSheet({ onClick, direction, isInputActive, onSetIsInputActive }: any) {
  const ref = useRef<SheetRef>();

  let listRecommendation = [
    {
      name: "Pasar Jepara",
      lattitude: "-6.300000",
      longitude: "106.816666",
    },
    {
      name: "Terminal bangsri",
      lattitude: "-6.300000",
      longitude: "106.816666",
    },
    {
      name: "SMAN 1 Tahunan",
      lattitude: "-6.300000",
      longitude: "106.816666",
    },
    {
      name: "Pasar Cangaan",
      lattitude: "-6.300000",
      longitude: "106.816666",
    },
  ];

  return (
    <>
      {/* <button onClick={() => onSetIsInputActive(true)}>Open sheet</button> */}

      <Sheet ref={ref} isOpen={isInputActive} onClose={() => onSetIsInputActive(false)} snapPoints={[680, 250]} initialSnap={1}>
        <Sheet.Container style={{ zIndex: 10, boxShadow: "0px 0px 11px -2px rgba(0,0,0,0.4", borderRadius: 27 }}>
          <Sheet.Header className="h-6" />
          <Sheet.Content>
            <Sheet.Scroller>
              <div className="w-full p-1">
                <div className="ml-5 flex w-full items-center">
                  <div className="">
                    <Image src="images/current.svg" className="object-cover w-4" width={500} height={500} alt="City" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm text-gray-300">PICKED UP</h3>
                    <h3 className="text-md text-gray-500">Lokasimu sekarang</h3>
                    {/* <input type="text" className=" focus:border-none focus:outline-none" placeholder="Cari Lokasi" /> */}
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              <div className="w-full" onClick={onClick}>
                <div className="ml-5 flex w-full items-center">
                  <div className="">
                    <Image src="images/location.svg" className="object-cover w-4" width={500} height={500} alt="City" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm text-gray-300">DROP-OFF</h3>
                    <h3 className="text-md text-gray-500">{direction || "Cari Lokasi tujuanmu"}</h3>
                    {/* <input type="text" className=" focus:border-none focus:outline-none" placeholder="Cari Lokasi" /> */}
                  </div>
                </div>
              </div>
              <div className="list-badge ml-2 flex mt-7 gap-2 overflow-x-auto h-16">
                {listRecommendation.map((item, index) => (
                  <span key={index} className="badge p-5 whitespace-nowrap shadow-lg border border-gray-100">
                    {item.name}
                  </span>
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
