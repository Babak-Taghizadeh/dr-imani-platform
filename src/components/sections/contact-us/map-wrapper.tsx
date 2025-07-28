"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./map"), {
  ssr: false,
});

const MapWrapper = () => {
  return <DynamicMap />;
};
export default MapWrapper;
