"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { FormEvent } from "react";
import Cookies from "js-cookie";
import { Bounce, toast } from "react-toastify";

const LoginSection = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password harus diisi.");
      return;
    }

    setIsLoading(true);
    console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
    console.log("Sending username and password to backend:", { username, password });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from backend:", response.data);

      if (response.status === 200) {
        toast("✅ Login Berhasil", {
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
        const expirationTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

        console.log("Expiration time:", expirationTime);

        Cookies.set("accessToken", response.data.access_token, {
          expires: expirationTime,
          path: "/",
        });

        window.dispatchEvent(new Event("tokenChange"));

        router.push("/allow-location");
      } else {
        toast.error("Login gagal, periksa username dan password Anda", {
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
        setError("Login gagal, periksa username dan password Anda.");
      }
    } catch (error) {
      console.log("Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.log("Axios error response:", error.response);
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
        setError(error.response.data.message || "Terjadi kesalahan pada server. Silakan coba lagi.");
      } else {
        console.log("Error:", error);
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
        setError("Terjadi kesalahan pada server. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action="" className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
      <div className="join mt-9 w-full">
        <label className="input input-bordered join-item flex items-center">
          <Image src="images/letter.svg" className="w-full" width={500} height={500} alt="Username Icon" />
        </label>
        <input name="username" className="input w-full input-bordered focus:outline-none join-item" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="join my-5 w-full">
        <label className="input input-bordered focus:outline-none join-item flex items-center">
          <Image src="images/key.svg" className="w-full" width={500} height={500} alt="Password Icon" />
        </label>
        <input name="password" type="password" className="input w-full input-bordered focus:outline-none join-item" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button className="my-5 mb-7 btn primary text-white w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginSection;
