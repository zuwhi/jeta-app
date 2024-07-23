"use client";
import React, { useState } from "react";
import Image from "next/image";
import SignUpSection from "./components/signup-section";
import LoginSection from "./components/login-section";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(0);

  function changeSection(num: number) {
    num == 0 ? setIsLogin(0) : setIsLogin(1);
  }

  const login = () => {
    router.push("/allow-location");
  };

  return (
    <main className="primary flex-col flex h-[80vh] w-full items-center  relative">
      <div className="px-5 w-full items-center flex flex-col mt-7 z-10">
        <Image src="/Logo.svg" className="w-28" width={500} height={500} alt="Logo" />
        <div className="mt-9 flex-col w-full card rounded-lg bg-white shadow-lg ">
          <div className="mt-1 w-full py-4 flex group">
            <div onClick={() => changeSection(0)} className="cursor-pointer flex-1 flex flex-col justify-center items-center h-14 w-full ">
              <h1 className={`text-xl font-medium ${isLogin == 0 ? "text-dark" : "text-grey"} `}>Sign In</h1>
              <div className={`h-1.5 rounded mt-1 w-10  ${isLogin == 0 ? "primary" : " "}`}></div>
            </div>
            <div onClick={() => changeSection(1)} className="cursor-pointer flex-1 flex flex-col justify-center items-center h-14 w-full ">
              <h1 className={`text-xl font-medium ${isLogin == 1 ? "text-dark" : "text-grey"} `}>Sign Up</h1>
              <div className={`h-1.5 rounded mt-1 w-10  ${isLogin == 1 ? "primary" : " "}`}></div>
            </div>
          </div>
          <hr className="mt-1 border" />
          <div className="w-full  px-5  ">{isLogin == 0 ? <LoginSection></LoginSection> : <SignUpSection></SignUpSection>}</div>
        </div>
        <div className="w-full px-5">
          <button onClick={() => login()} className="my-7 btn grey-bg text-white w-full">
            Masuk tanpa akun
          </button>
        </div>
      </div>

      <div
        className="flex flex-col absolute top-16 w-full h-full
"
      >
        <Image src="images/city.svg" className="city object-fit w-full sm:flex hidden" width={500} height={500} alt="City" />
        <Image src="images/city-crop.svg" className="city object-cover w-full sm:hidden flex" width={500} height={500} alt="City" />

        <div className="w-full bg-white h-full"></div>
      </div>
    </main>
  );
};

export default Page;
