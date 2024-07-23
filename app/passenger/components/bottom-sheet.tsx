"use client";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { DetailDriver } from "@/app/type/detail_driver";
export default function BottomSheet({
  direction,
  isInputActive,
  onSetIsInputActive,
  destinationRecomendation,
  showRecommendation,
  setShowRecommendation,
}: {
  direction: any;
  isInputActive: any;
  onSetIsInputActive: any;
  destinationRecomendation: DestinationType | null;
  showRecommendation: boolean;
  setShowRecommendation: (open: boolean) => void;
}) {
  const ref = useRef<SheetRef>();

  const [isLoading, setIsLoading] = useState(false);
  const [detailsUser, setDetailUser] = useState<DetailDriver | null>();
  useEffect(() => {
    const fetchDetailUser = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("accessToken");
        if (token) {
          const responseProfile = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/driver/${destinationRecomendation?.driver_id}`, {
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
  }, [destinationRecomendation]);

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

  const snapPoints = showRecommendation ? [700, 600, 250] : [680, 250];

  return (
    <>
      <Sheet ref={ref} isOpen={isInputActive} onClose={() => onSetIsInputActive(false)} snapPoints={snapPoints} initialSnap={1}>
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
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              <div className="w-full">
                <div className="ml-5 flex w-full items-center">
                  <div className="">
                    <Image src="images/location.svg" className="object-cover w-4" width={500} height={500} alt="City" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm text-gray-300">DROP-OFF</h3>
                    <h3 className="text-md text-gray-500">{direction || "Cari Lokasi tujuanmu"}</h3>
                  </div>
                </div>
              </div>

              {showRecommendation ? null : (
                <div className="list-badge ml-2 flex mt-7 gap-2 overflow-x-auto h-16">
                  {listRecommendation.map((item, index) => (
                    <span key={index} className="badge p-5 whitespace-nowrap shadow-lg border border-gray-100">
                      {item.name}
                    </span>
                  ))}
                </div>
              )}

              <hr className="my-3" />
              <div className="px-5 w-full mt-2">
                <h3 className="text-lg ">Angkutan terdekat </h3>
                <h3 className="text-lg ">Berdasarkan tujuanmu :</h3>
                <div className="w-full shadow border px-1 py-5  rounded-xl mt-3">
                  <>
                    <div className="w-full py-2  px-4 flex">
                      <div className="w-[20%]">
                        <Image src="icons/angkot.svg" className="w-10" width={500} height={500} alt="Logo" />
                      </div>
                      <div className="w-[50%]">
                        <p className="text-md font-semibold ">Pak. {detailsUser && detailsUser.firstname + " " + detailsUser.lastname}</p>
                        <p className="text-sm ">{"Angkutan"}</p>
                      </div>
                      <div className="w-[30%] ">
                        <p className="text-right text-sm text-red-500">Rp. 5000</p>
                        <p className="text-right text-xs text-gray-400">per 5 km</p>
                      </div>
                    </div>
                    <hr className="" />

                    <div className="w-full px-5 mt-4">
                      <table className="w-full text-sm ">
                        <tbody>
                          <tr>
                            <td className="text-left">Plat Nomor :</td>
                            <td className="text-right font-medium">K 4020 4</td>
                          </tr>
                          <tr>
                            <td className="text-left">Estimasi kedatangan :</td>
                            <td className="text-right font-medium"> 30 menit</td>
                          </tr>
                          <tr>
                            <td className="text-left">Status :</td>
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
                  </>
                </div>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
}
