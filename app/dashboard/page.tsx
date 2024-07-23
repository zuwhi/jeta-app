"use client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useProfile } from "../provider/auth_provider";
import axios from "axios";
import Link from "next/link";
import { Bounce, toast } from "react-toastify";

interface Cuaca {
  jamCuaca: string;
  kodeCuaca: string;
  cuaca: string;
  humidity: string;
  tempC: string;
  tempF: string;
}
interface NewsType {
  link: string;
  title: string;
  pubDate: String;
  description: string;
  thumbnail: string;
}

export default function Dashboard() {
  const token = Cookies.get("accessToken");
  const router = useRouter();

  if (!token) {
    router.push("/login");
  }
  const { profile } = useProfile();
  const [cuaca, setCuaca] = useState<Cuaca[]>([]);
  const [cuacaSekarang, setCuacaSekarang] = useState<Cuaca | null>(null);
  const [iconWeather, setIconWeather] = useState("");
  const [news, setNews] = useState<NewsType[]>([]);
  const modalRef = useRef<HTMLDialogElement>(null);

  async function getCuaca() {
    try {
      const response = await fetch(`https://ibnux.github.io/BMKG-importer/cuaca/501244.json`);
      const data = await response.json();
      setCuaca(data);
      filterCuacaSekarang(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    modalRef.current?.close();
  };

  const handleLogout = async () => {
    const token = Cookies.get("accessToken");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Cookies.remove("accessToken");

      if (response.status === 200) {
        router.push("/login");
        toast.success("Berhasil Log out", {
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
      }
    } catch (error) {
      toast.error("Failed to logout", {
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
    }
  };

  function filterCuacaSekarang(data: Cuaca[]) {
    const now = new Date();
    let closestCuaca: Cuaca | null = null;
    let minDiff = Infinity;

    data.forEach((cuaca) => {
      const cuacaDate = new Date(cuaca.jamCuaca);
      const diff = Math.abs(now.getTime() - cuacaDate.getTime());

      if (diff < minDiff) {
        minDiff = diff;
        closestCuaca = cuaca;
      }
    });

    setCuacaSekarang(closestCuaca);
    // getIconWeather(closestCuaca.jamCuaca ??"");
  }

  function getIconWeather(cuaca: string) {
    switch (cuaca.toLocaleLowerCase()) {
      case "berawan":
        setIconWeather("icons/mendung.svg");
        break;
      case "hujan ringan":
        setIconWeather("icons/hujan.svg");
        break;
      case "cerah berawan" || "cerah":
        setIconWeather("icons/cerah.svg");
        break;
      default:
        setIconWeather("icons/cerah.svg");
    }
  }

  useEffect(() => {
    getCuaca();
  }, []);

  useEffect(() => {
    getIconWeather(cuacaSekarang?.cuaca ?? "");
  }, [cuacaSekarang]);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await axios.get(`https://api-berita-indonesia.vercel.app/cnn/nasional/`);

        // console.log(response.data.data.posts);
        console.log(response.data.data.posts);

        setNews(response.data.data.posts);
      } catch (error) {
        console.log(error);
      }
    };

    getNews();
  }, []);

  return (
    <div>
      <div className="relative">
        <div className="relative pt-3 primary h-screen z-0">
          <div className="navbar py-2">
            <div className="flex-1">
              <div className="w-11 mx-2 rounded-full">
                <Image src="icons/avatar.svg" width={500} height={500} alt="Logo" />
              </div>
              <div className="ml-1 text-white">
                <h1 className=" font-medium ">Halo, {profile?.username}</h1>
                <h1 className=" text-sm">as a {profile?.role}</h1>
              </div>
            </div>
            <div className="flex-none">
              <button
                className="btn  btn-ghost"
                onClick={() => {
                  modalRef.current?.showModal();
                }}
              >
                <Image className="w-8" src="icons/logout.svg" width={500} height={500} alt="Logo" />
              </button>
            </div>
          </div>
        </div>
        <div className="absolute w-full rounded-t-3xl shadow-[rgba(0,0,0,0.1)_0px_0px_20px_4px] top-24 bg-white z-10">
          <div className=" flex w-full mt-6">
            <div className="weather mx-5 flex rounded-2xl h-36 w-full primary shadow-md">
              {cuacaSekarang ? (
                <div className="flex-1 flex p-4 flex-col justify-center">
                  <span className="text-white font-medium text-4xl">{cuacaSekarang.tempC}°</span>
                  <span className="text-white text-lg font-medium">{cuacaSekarang.cuaca}</span>
                  <div className="flex">
                    <Image className="h-4 w-4 mr-1" src="icons/loc.svg" width={500} height={500} alt="Logo" />
                    <span className="text-white text-sm font-medium">Jepara</span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex justify-center items-center">
                  <span className="loading loading-spinner text-white"></span>
                </div>
              )}

              <div className="flex-1 flex  justify-end items-center">
                <div className="w-44">
                  {iconWeather != "" ? (
                    <Image src={iconWeather} width={500} height={500} alt="Logo" />
                  ) : (
                    <div className="flex-1 flex  justify-center items-center">
                      <span className="loading loading-spinner text-white"></span>{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 px-5 w-full">
            <h2 className="mb-3 text-gray-600 font-normal text-xl">Find Your Route</h2>
            <div className="flex w-full gap-5">
              <div className="map flex w-[70%] relative">
                <div className="w-full rounded-xl bg-slate-500 h-72 relative overflow-hidden">
                  <Image className="absolute top-0 left-0 w-full h-full object-cover" src="/images/map-jepara.svg" width={500} height={500} alt="jepara-image" />
                </div>
                <Link href="/allow-location">
                  <div className="go hover:bg-opacity-20 z-20 rounded-xl hover:bg-black absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <Image src="icons/search.svg" className="w-10" width={500} height={500} alt="allow-location" />
                  </div>
                </Link>
              </div>
              <div className="w-[30%]">
                <Link href="/chatbot">
                  <div className="rounded-xl flex flex-col justify-center items-center shadow hover:shadow-lg border border-gray-100 h-24">
                    <Image className="w-11" src="icons/chat.svg" width={500} height={500} alt="Logo" />
                    <span className="text-gray-500 text-sm mt-1">chatbot</span>
                  </div>
                </Link>

                <Link href="/info-driver">
                  <div className="rounded-xl mt-4 flex flex-col justify-center items-center hover:shadow-lg shadow border border-gray-100 h-24">
                    <Image className="w-11" src="icons/list.svg" width={500} height={500} alt="Logo" />

                    <span className="text-gray-500 text-sm mt-1">Data</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-7 px-5 w-full">
            <h2 className="mb-1 text-gray-600 font-normal text-xl">Baca berita terbaru</h2>
            {news.map((item: NewsType, index) => (
              <Link href={item.link} key={index} target="_blank">
                <div className="weather mb-4  flex rounded-xl h-28 w-full border border-slate-100 shadow-md">
                  <div className="w-[70%] p-3 flex flex-col justify-between">
                    <h2 className="text-gray-600 font-normal text-sm">{item.title}</h2>
                    <span className="text-xs text-slate-400">{item.pubDate}</span>
                  </div>
                  <div className="w-[30%] p-2">
                    <Image className="rounded h-full" src={item.thumbnail} width={500} height={500} alt="a" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box ">
          <div className="w-full flex flex-col items-center ">
            <Image className="rounded h-full w-52" src="story/question.svg" width={500} height={500} alt="a" />
            <h3 className="font-medium text-center text-lg">
              Apakah kakmu yakin ingin <br /> Log out ?
            </h3>
          </div>

          <div className="modal-action flex gap-2 justify-center w-full ">
            <form method="dialog" onSubmit={handleSubmit}>
              {/* if there is a button in form, it will close the modal */}
              <button className="btn w-36">Tidak</button>
            </form>
            <button onClick={() => handleLogout()} className="btn w-36 text-white primary">
              Iya
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
