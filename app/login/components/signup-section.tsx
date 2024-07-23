import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState, useRef, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

const SignUpSection = () => {
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [operationalTime, setOperationalTime] = useState("");
  const [route, setRoute] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!firstname || !lastname || !username || !email || !phone || !password) {
      setError("Semua field harus diisi.");
      return;
    }

    setIsLoading(true);

    console.log("Sending registration data to backend:", { username, password, firstname, lastname, email, phone, operationalTime, route });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/register`, {
        username,
        password,
        firstname,
        lastname,
        email,
        phone,
        role: "Passenger",
        operational_time: operationalTime,
        route,
      });

      if (modalRef.current) {
        modalRef.current.showModal();
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
        setError(error.response.data.message || "Terjadi kesalahan pada server. Silakan coba lagi.");
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
        setError("Terjadi kesalahan pada server. Silakan coba lagi.");
      }
      setError("Terjadi kesalahan pada server. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form action="" className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="join mt-9 w-full">
          <label className="input input-bordered focus:outline-none join-item flex items-center">
            <Image src="images/user.svg" className="w-full" width={500} height={500} alt="Firstname Icon" />
          </label>
          <input className="input w-full input-bordered focus:outline-none  join-item" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        </div>
        <div className="join mt-5 w-full">
          <label className="input input-bordered focus:outline-none join-item flex items-center">
            <Image src="images/user.svg" className="w-full" width={500} height={500} alt="Lastname Icon" />
          </label>
          <input className="input w-full input-bordered focus:outline-none join-item" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </div>
        <div className="join mt-5 w-full">
          <label className="input input-bordered focus:outline-none join-item flex items-center">
            <Image src="images/user.svg" className="w-full" width={500} height={500} alt="Username Icon" />
          </label>
          <input className="input w-full input-bordered focus:outline-none join-item" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="join mt-5 w-full">
          <label className="input input-bordered focus:outline-none join-item flex items-center">
            <Image src="images/letter.svg" className="w-full" width={500} height={500} alt="Email Icon" />
          </label>
          <input className="input w-full input-bordered focus:outline-none join-item" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="join mt-5 w-full">
          <label className="input input-bordered focus:outline-none join-item flex items-center">
            <Image src="icons/phone.svg" className="w-full" width={500} height={500} alt="Phone Icon" />
          </label>
          <input className="input w-full input-bordered focus:outline-none join-item" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="join mt-5 w-full">
          <label className="input input-bordered focus:outline-none join-item flex items-center">
            <Image src="images/key.svg" className="w-full" width={500} height={500} alt="Password Icon" />
          </label>
          <input className="input w-full input-bordered focus:outline-none join-item" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <div className="text-red-500 my-4">{error}</div>}
        {isSuccess && <div className="text-green-500 my-4">Registrasi berhasil!</div>}
        <button className="my-5 mb-7 btn primary text-white w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <dialog id="my_modal_2" className="modal" ref={modalRef}>
        <div className="modal-box  flex flex-col items-center justify-center ">
          <Image src="icons/check.svg" className="my-5 w-28" width={500} height={500} alt="success Icon" />
          <h3 className="font-bold text-2xl text-center">Registrasi Berhasil!</h3>
          <p className="py-4 text-center">Terima kasih telah mendaftar. silahkan login menggunakan akun anda</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default SignUpSection;
