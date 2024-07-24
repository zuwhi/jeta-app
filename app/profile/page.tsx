"use client";

import Image from "next/image";

import { useProfile } from "../provider/auth_provider";
export default function Page() {
  const { profile } = useProfile();
  console.log("Profile: ", profile);

  return (
    <div className="w-full h-screen">
      <div className="w-full h-36 primary flex flex-col justify-between">
        <div className=""></div>
        <div className="pb-5">
          <button onClick={() => window.history.back()}>
            <Image className="w-8 ml-2 mb-3" src="icons/back-white.svg" width={500} height={500} alt="Logo" />
          </button>
          <div className="flex px-5">
            <div className="flex-1">
              <h1 className="text-3xl  text-white">Profile</h1>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="w-11 mx-2 rounded-full">
                <Image src="icons/avatar.svg" width={500} height={500} alt="Logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white px-4 mt-5">
        {profile?.role === "Driver" ? (
          <table className="w-full h-full text-md">
            <tbody>
              <tr className="tr-spacing">
                <td className="text-left">Plat Nomor :</td>
                <td className="text-right font-medium">{profile?.angkutan_number}</td>
              </tr>
              <tr className="tr-spacing">
                <td className="text-left">Alamat :</td>
                <td className="text-right font-medium">{profile?.status}</td>
              </tr>
              <tr className="tr-spacing">
                <td className="text-left">Jam Kerja :</td>
                <td className="text-right font-medium">{profile?.operational_time}</td>
              </tr>
              <tr className="tr-spacing">
                <td className="text-left">Rute :</td>
                <td className="text-right font-medium">{profile?.route}</td>
              </tr>
              <tr className="tr-spacing">
                <td className="text-left">Brand Mobil:</td>
                <td className="text-right font-medium">{profile?.brand_car}</td>
              </tr>
              <tr className="tr-spacing">
                <td className="text-left">Series Mobil :</td>
                <td className="text-right font-medium">{profile?.series_car}</td>
              </tr>
              <tr className="tr-spacing">
                <td className="text-left">Nomer Hp :</td>
                <td className="text-right font-medium">{profile?.phone_number}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full text-md">
            <tbody>
              <tr className="tr-spacing">
                <td className="text-left">Nama :</td>
                <td className="text-right font-medium">{profile?.firstname + " " + profile?.lastname}</td>
              </tr>
              <tr className="tr-spacing">
                <td className="text-left">Email :</td>
                <td className="text-right font-medium">{profile?.email}</td>
              </tr>
              <tr className="tr-spacing">
                <td className="text-left">Nomor HP :</td>
                <td className="text-right font-medium">{profile?.phone_number}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
