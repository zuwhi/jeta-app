"use client";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function BottomSheet({ onClick, direction }: any) {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef<SheetRef>();
  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open sheet</button>

      {/* Opens to 400 since initial index is 1 */}
      <Sheet ref={ref} isOpen={isOpen} onClose={() => setOpen(false)} snapPoints={[680, 250]} initialSnap={1}>
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
                <span className="badge p-5 whitespace-nowrap shadow-lg border border-gray-100">Terminal Bangsri</span>
                <span className="badge p-5 whitespace-nowrap shadow-lg border border-gray-100">SMA 1 Jepara</span>
                <span className="badge p-5 whitespace-nowrap shadow-lg border border-gray-100">SMA 1 Jepara</span>
                <span className="badge p-5 whitespace-nowrap shadow-lg border border-gray-100">SMA 1 Jepara</span>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        {/* <Sheet.Backdrop /> */}
      </Sheet>
    </>
  );
}
