"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { useProfile } from "../provider/auth_provider";
import Link from "next/link";
const Page = () => {
  const router = useRouter();
  const { profile } = useProfile();

  console.log("Profile:", profile);

  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {});
      }
    };

    requestLocation();
  }, [router]);

  return (
    <div className="primary flex flex-col items-center w-full h-screen">
      <Image src="story/direction.svg" className="w-[20rem] mt-10" width={500} height={500} alt="allow-location" />
      <h1 className="text-3xl text-white font-semibold mt-7">Hidupkan GPS</h1>
      <h3 className="w-[21rem] text-slate-200 text-[0.8rem] text-center mt-2">
        Hai {profile ? `${profile.role}` : "-"}, kamu harus menghidupkan GPS terlebih dahulu dan menginjinkan browser untuk mengetahui lokasimu
      </h3>
      <button
        className="btn mt-20 font-semibold text-primary w-44 "
        onClick={() =>
          navigator.geolocation.getCurrentPosition(
            () => {
              // Jika GPS diaktifkan, arahkan ke halaman /passenger

              if (profile) {
                if (profile.role === "Driver") {
                  router.push("/driver-route");
                } else {
                  router.push("/passenger");
                }
              }
            },
            () => {
              // Jika pengguna menolak atau GPS tidak aktif, tetap di halaman ini
            }
          )
        }
      >
        Lacak Route
      </button>
      <Link href="/dashboard" className="text-sm text-slate-300 mt-4">Pergi ke Dashboard</Link>
    </div>
  );
};

export default Page;
