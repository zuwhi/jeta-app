"use client";
import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { ruteDriver } from "../data/rute_driver";
import MapRuteDriver from "./components/map_driver";
import { useProfile } from "../provider/auth_provider";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bounce, toast } from "react-toastify";
import ButtonBack from "../global_component/button_back";

interface RouteItem {
  label: string;
  value: string;
}

export default function DriverRoute() {
  const router = useRouter();
  const { profile } = useProfile();
  const [rute, setRute] = useState<RouteItem[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [originDriver, setOriginDriver] = useState<string>("");
  const handleChange = (selected: RouteItem[]) => {
    setRute(selected);
    const values = selected.map((item) => item.value);
    setSelectedValues(values);
  };

  const handleClick = async () => {
    const token = Cookies.get("accessToken");
    console.log("token", token);

    const listString = selectedValues.join(";");
    console.log(listString);

    if (profile && token) {
      if (originDriver !== "") {
        const data = {
          // driver_id: 1,
          origin: originDriver,
          destination: selectedValues,
          driver_id: profile?.id || 0,
        };

        console.log("Data to be sent to backend:", data);

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/update_destination`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            toast("✅ Berhasil mengirimkan lokasimu ke penumpang", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
            const queryParams = new URLSearchParams();
            queryParams.append("coordinates", listString);
            router.push(`/driver?${queryParams.toString()}`);
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            // Tangani error dari respons backend
            toast.error(`Error: ${error.response.data.message}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          } else {
            // Tangani error lainnya
            toast.error("Terjadi kesalahan pada server. Silakan coba lagi.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          }
        }
      } else {
        console.error("Origin is empty.");
      }
    } else {
      console.error("Profile or token is missing.");
    }
  };

  return (
    <>
      <ButtonBack />
      <div className="w-full h-screen relative flex flex-col items-center px-5">
        <div className="w-full">
          <h3 className="font-medium text-lg leading-5">
            Masukkan Rute <br /> Tujuan Perjalanan mu
          </h3>
        </div>

        <MultiSelect
          className="w-full mt-4"
          options={ruteDriver}
          value={rute}
          onChange={handleChange}
          labelledBy="Select"
          overrideStrings={{
            selectSomeItems: "Cari rute...",
            allItemsAreSelected: "Semua item telah dipilih",
            search: "Cari...",
            selectAll: "Pilih Semua",
            clearSearch: "Bersihkan Pencarian",
          }}
          hasSelectAll={false}
        />

        <div className="w-full my-4">
          <h3 className="font-medium leading-5">Rute yang kamu pilih :</h3>
        </div>

        <div className="relative h-96 w-full z-0 px-1">
          <div className="card w-full h-96 ">
            <MapRuteDriver listDirection={selectedValues} setOriginDriver={setOriginDriver} />
          </div>
        </div>
        <div className="relative mt-10 w-full flex justify-center">
          <button className="btn absolute   btn-accent text-white" onClick={() => handleClick()}>
            Mulai Bagikan Lokasi
          </button>
        </div>
      </div>
    </>
  );
}
