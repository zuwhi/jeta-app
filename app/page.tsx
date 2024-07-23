"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import Link from "next/link";
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <Link href="/dashboard">
      <main className="primary flex-col flex min-h-screen w-full items-center justify-center relative">
        <div className="title flex-col flex items-center justify-center z-10">
          <Image src="/Logo.svg" className="w-32" width={500} height={500} alt="Logo" />
          <h1 className="text-5xl mt-8 text-white font-semibold">JETA</h1>
          <h2 className="text-center mt-3 mb-28 max-w-72 text-xl text-white font-semibold">Jepara E-Transport Application</h2>
        </div>
        <div className=" absolute bottom-0 w-full  overflow-hidden">
          <Image src="images/city.svg" className="city object-fit w-full sm:flex hidden" width={500} height={500} alt="City" />
          <Image src="images/city-crop.svg" className="city object-cover w-full sm:hidden flex" width={500} height={500} alt="City" />
        </div>
      </main>
    </Link>
  );
}
