"use client";

import { getModByIdFn } from "@/services/mod";
import { useEffect, useState } from "react";

export default function SingleModShow({ params }: { params: { _id: string } }) {
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMod = async () => {
      try {
        const data = await getModByIdFn(params._id);
        setMod(data);
      } catch (error) {
        console.error("Error fetching mod:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMod();
  }, [params._id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!mod) {
    return <p>Mod not found.</p>;
  }

  return (
    <div>
      <h1>{mod.title}</h1>
      <p>{mod.description}</p>
      {/* Render other mod details as needed */}
      <div>
        {/* For example, rendering an image */}
        {mod.main_image && <img src={mod.main_image.url} alt={mod.title} />}
      </div>
    </div>
  );
}
