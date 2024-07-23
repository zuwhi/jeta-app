"use client";
import { useState } from "react";

const FetchWithAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClick = async () => {
    const url = "http://127.0.0.1:5000/update";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxOTY3MzMxNSwianRpIjoiYjc5ZjI1ZWUtZDU4My00OWIwLWI0ZTctY2RjZDA2ZTNhNWVkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJpZCI6MiwidXNlcm5hbWUiOiJyb25hbGRvIiwicm9sZSI6IkRyaXZlciJ9LCJuYmYiOjE3MTk2NzMzMTUsImNzcmYiOiIwZjYwZWIzMS03YTA0LTQ2OWItOWVlOS00NGM5NTAwMzQyYjUiLCJleHAiOjE3MTk2NzQyMTV9.lkytm4wsS6zWoCcHkEkIQP-hGC94mkiJyut0_gwc8UY";

    const data = {
      driver_id: "2",
      origin: { lat: 100.0, lng: 100.56 },
      destination: { lat: 777.89, lng: 777.12 },
      heading: 90,
    };

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setSuccess(JSON.stringify(responseData));
    } catch (error: any) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Driver</h1>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : "Kirim Request"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {success && <p style={{ color: "green" }}>Success: {success}</p>}
    </div>
  );
};

export default FetchWithAxios;
