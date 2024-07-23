"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface Profile {
  email: string;
  firstname: string;
  id: number;
  lastname: string;
  operational_time: string;
  phone_number: string;
  role: string;
  route: string;
  username: string;
}

interface ProfileContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const responseProfile = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (responseProfile.data.user) {
          setProfile(responseProfile.data.user);
          const expirationTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

          Cookies.set("userRole", responseProfile.data.user.role, {
            expires: expirationTime,
            path: "/",
          });

          console.log("Profile:", responseProfile.data.user.role);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleTokenChange = () => {
      fetchProfile();
    };

    window.addEventListener("tokenChange", handleTokenChange);

    return () => {
      window.removeEventListener("tokenChange", handleTokenChange);
    };
  }, []);

  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a AuthProvider");
  }
  return context;
};
