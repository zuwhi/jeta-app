"use client";
import React, { useEffect } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("Terdapat penumpang didekatmu!", {
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
    }, 1000);

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);

  return (
    <div>
      <h1>Welcome to My Page</h1>
      <ToastContainer />
    </div>
  );
};

export default App;
