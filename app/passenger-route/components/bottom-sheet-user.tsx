"use client";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { DetailDriver } from "@/app/type/detail_driver";
interface BottomSheetUserProps {
  isBottomSheetUserOpen: boolean;
  setBottomSheetUserOpen: (open: boolean) => void;
  driverId: number;
}

export default function BottomSheetUser({ isBottomSheetUserOpen, setBottomSheetUserOpen, driverId }: BottomSheetUserProps) {
  const ref = useRef<SheetRef>();

  const [isLoading, setIsLoading] = useState(false);
  const [detailsUser, setDetailUser] = useState<DetailDriver | null>();
  useEffect(() => {
    const fetchDetailUser = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("accessToken");
        if (token) {
          const responseProfile = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/driver/${driverId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response from backend: ", responseProfile.data.driver);
          console.log(responseProfile.data.driver);

          if (responseProfile.data.driver) {
            setDetailUser(responseProfile.data.driver);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailUser();
  }, []);

  return (
    <>
      <Sheet ref={ref} isOpen={isBottomSheetUserOpen} onClose={() => setBottomSheetUserOpen(false)} snapPoints={[600, 400]} initialSnap={1}>
        <Sheet.Container style={{ zIndex: 10, boxShadow: "0px 0px 11px -2px rgba(0,0,0,0.4)", borderRadius: 27 }}>
          <Sheet.Header className="h-6" />
          <Sheet.Content>
            <Sheet.Scroller>
              {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <span className="loading loading-spinner text-success"></span>
                </div>
              ) : (
                <>
                  <div className="w-full py-2  px-4 flex">
                    <div className="w-[20%]"></div>
                    <div className="w-[50%]">
                      <p className="text-xl font-semibold ">{"Angkutan"}</p>
                    </div>
                    <div className="w-[30%] ">
                      <p className="text-right text-xl text-red-500">Rp. 5000</p>
                      <p className="text-right text-sm text-gray-400">per 5 km</p>
                    </div>
                  </div>
                  <hr className="" />
                  <div className="w-full mt-4 px-5 flex">
                    <div className="w-[20%] flex ">
                      <div className="avatar">
                        <div className="w-14 rounded-full">
                          <Image src="icons/avatar.svg" width={500} height={500} alt="Logo" />
                        </div>
                      </div>
                    </div>
                    <div className="w-[60%] flex items-center">{detailsUser && detailsUser.firstname + " " + detailsUser.lastname}</div>
                    <div className="w-[20%] flex items-center justify-end">
                      <div className="bg-accent px-5 py-1 rounded text-white">Aktif</div>
                    </div>
                  </div>
                  <div className="w-full px-5 mt-4">
                    <table className="w-full text-md ">
                      <tbody>
                        <tr>
                          <td className="text-left">Plat Nomor :</td>
                          <td className="text-right font-medium">K 4020 4</td>
                        </tr>
                        <tr>
                          <td className="text-left">Alamat :</td>
                          <td className="text-right font-medium">{detailsUser && detailsUser.status}</td>
                        </tr>
                        <tr>
                          <td className="text-left">Jam Kerja :</td>
                          <td className="text-right font-medium">{detailsUser && detailsUser.operational_time}</td>
                        </tr>
                        <tr>
                          <td className="text-left">Rute :</td>
                          <td className="text-right font-medium">{detailsUser && detailsUser.route}</td>
                        </tr>
                        <tr>
                          <td className="text-left">Nomer Hp :</td>
                          <td className="text-right font-medium">{detailsUser && detailsUser.phone_number}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="w-full px-4 mt-6">
                    <button onClick={() => setBottomSheetUserOpen(false)} className="btn text-white text-lg w-full btn-accent">
                      Kembali
                    </button>
                  </div>
                </>
              )}
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
}
