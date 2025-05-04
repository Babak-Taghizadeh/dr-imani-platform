"use client";

import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { useEffect, useRef, useState } from "react";
import { CornerUpRight, Loader } from "lucide-react";
import { Button } from "../ui/button";

const NeshanMap = () => {
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const apiKeyRef = useRef<string | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Fetch API Key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/map");
        const data = await response.json();
        if (data.apiKey) {
          apiKeyRef.current = data.apiKey;
          setApiKeyLoaded(true);
        } else {
          console.error("Failed to fetch API key");
        }
      } catch (error) {
        console.error("Error fetching API key:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  // Initialize Map after API key is loaded
  useEffect(() => {
    if (apiKeyLoaded && mapContainerRef.current) {
      setLoading(true);
      mapRef.current = new mapboxgl.Map({
        mapType: mapboxgl.Map.mapTypes.neshanVector,
        container: mapContainerRef.current,
        zoom: 13,
        pitch: 0,
        center: [46.3224, 38.0573],
        minZoom: 2,
        maxZoom: 21,
        trackResize: true,
        mapKey: apiKeyRef.current!,
        poi: false,
        traffic: false,
      }) as unknown as mapboxgl.Map;

      mapRef.current.on("load", () => {
        drawMarkerOnMap();
        setLoading(false);
      });
    }
  }, [apiKeyLoaded]);

  // Function to draw marker on map
  function drawMarkerOnMap() {
    const map = mapRef.current;

    if (map) {
      new mapboxgl.Marker({ color: "purple" })
        .setLngLat([46.318, 38.059])
        .addTo(map);
    }
  }

  // Handle directions button click
  const getDirections = () => {
    const url =
      "https://neshan.org/maps/places/_bA9vXYCMD41#c38.059-46.318-21z-0p";
    window.open(url, "_blank");
  };

  return (
    <div className="relative h-[40dvh] w-full rounded-md lg:h-[50dvh] lg:w-[80%]">
      {loading && (
        <Loader className="absolute top-0 right-0 bottom-0 left-0 z-50 m-auto h-11 w-11 animate-spin text-[#2f7df4]" />
      )}
      <div ref={mapContainerRef} className="h-full w-full rounded-md">
        <Button
          onClick={getDirections}
          //   variant="custom"
          className="absolute top-3 right-2 z-50 gap-2"
        >
          <CornerUpRight size={20} />
          مسیریابی
        </Button>
      </div>
    </div>
  );
};

export default NeshanMap;
