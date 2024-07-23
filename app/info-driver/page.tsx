"use client";
import { useEffect, useState } from "react";
import { dummyDriver } from "../data/dummy_driver";
import { DetailDriver } from "../type/detail_driver";
import Link from "next/link";
import ButtonBack from "../global_component/button_back";

export default function Page() {
  const [dataDriver, setDataDriver] = useState<DetailDriver[] | null>(dummyDriver);
  const [filteredDrivers, setFilteredDrivers] = useState<DetailDriver[] | null>(dummyDriver);
  const [selectedDriver, setSelectedDriver] = useState<DetailDriver | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleViewDetails = (driver: DetailDriver) => {
    setSelectedDriver(driver);
  };

  const handleCloseModal = () => {
    setSelectedDriver(null);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredDrivers(dataDriver);
    } else {
      setFilteredDrivers(dataDriver?.filter((driver) => driver.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || driver.route.toLowerCase().includes(searchTerm.toLowerCase())) || null);
    }
  }, [searchTerm, dataDriver]);

  return (
    <>
      <ButtonBack />
      <div className="flex flex-col px-5 min-h-screen py-1">
        <h1 className="text-2xl font-semibold mb-4 pb-3 text-center">Lihat Data Driver</h1>
        <label className="input input-bordered flex items-center gap-2 mb-5">
          <input type="text" className="grow" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
          </svg>
        </label>
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firstname</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers?.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.firstname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className={`badge py-1 px-3 text-white ${driver.status === "on" ? "bg-accent" : "bg-red-500"}`}>{driver.status}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleViewDetails(driver)}>
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDriver && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Detail Driver</h3>
              <p className="py-2">
                <strong>ID:</strong> {selectedDriver.id}
              </p>

              <p className="py-2">
                <strong>Firstname:</strong> {selectedDriver.firstname}
              </p>
              <p className="py-2">
                <strong>Lastname:</strong> {selectedDriver.lastname}
              </p>
              <p className="py-2">
                <strong>Email:</strong> {selectedDriver.email}
              </p>
              <p className="py-2">
                <strong>Phone Number:</strong> {selectedDriver.phone_number}
              </p>
              <p className="py-2">
                <strong>Operational Time:</strong> {selectedDriver.operational_time}
              </p>
              <p className="py-2">
                <strong>Role:</strong> {selectedDriver.role}
              </p>
              <p className="py-2">
                <strong>Route:</strong> {selectedDriver.route}
              </p>
              <div className="modal-action">
                <button className="btn" onClick={handleCloseModal}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
