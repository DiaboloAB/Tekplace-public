"use client";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import More from "./components/more";
import Canvas from "./components/canvas";
import Info from "./components/info";
import { Pixel } from "@/types/map";
import callApi from "@/hooks/callApi";
import useResize from "@/hooks/useResize";
import useKeydown from "@/hooks/useKeyDown";
import {connectToSocket, emitEvent} from "@/hooks/connectToSocket";
import Place from "./components/place";

let called = false;

export default function Home() {
  const [mapSize, setMapSize] = useState({ x: 200, y: 200 });
  const [selectedPixel, setSelectedPixel] = useState({ x: -1, y: -1 });
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedPixelData, setSelectedPixelData] = useState({ color: -1, name: "" });
  const [pixelMap, setPixelMap] = useState([] as Pixel[]);
  const [userData, setUserData] = useState({ email: "", nbPixels: 0, name: "" });
  const [ranking , setRanking] = useState({ users : [], totalPixels: 0 });
  const [timeLeft, setTimeLeft] = useState(-1);

  const [ colors, setColors ] = useState([]);
  const { instance, accounts } = useMsal();
  const canvasSize = useResize();
  useKeydown(mapSize, setSelectedPixel);

  useEffect(() => {
    connectToSocket(accounts, instance, setTimeLeft, setUserData, setPixelMap, pixelMap);
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === -1) {
          emitEvent("getPixel", {});
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    for (const pixel of pixelMap) {
      if (pixel.position.x === selectedPixel.x && pixel.position.y === selectedPixel.y) {
        setSelectedPixelData(pixel);
        return;
      }
    }
    setSelectedPixelData({ color: -1, name: "" });
  }, [selectedPixel]);

  useEffect(() => {
    if (called) {
      return;
    }
    callApi({
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/user",
      action: (data: any) => {
        setUserData(data);
        setTimeLeft(Math.floor(data.timeLeftForPixel));
      },
    }, accounts, instance);
    callApi({
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/map",
      action: (data: any) => {
        setColors(data.colors);
        setPixelMap(data.pixels);
        setMapSize(data.mapSize);
      },
    }, accounts, instance);
    callApi({
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/ranking",
      action: (data: any) => {
        setRanking(data);
      },
    }, accounts, instance);
    called = true;
  }, []);

  const placePixel = () => {
    if (userData.nbPixels <= 0)
      return;
    if (selectedColor < 0 || selectedColor >= colors.length) {
      console.error("Invalid color selected");
      return;
    }
    if (selectedPixel.x < 0 || selectedPixel.x >= mapSize.x || selectedPixel.y < 0 || selectedPixel.y >= mapSize.y) {
      console.error("Invalid pixel selected");
      return;
    }
    emitEvent("placePixel", { x: selectedPixel.x, y: selectedPixel.y, color: selectedColor });
    pixelMap.push({ position: { x: selectedPixel.x, y: selectedPixel.y }, color: selectedColor, name: userData.name });
    setPixelMap([...pixelMap]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <Place colors={colors} selectedPixel={selectedPixel} selectedPixelData={selectedPixelData} selectedColor={selectedColor} placePixel={placePixel}
        nbPixels={userData.nbPixels} timer={timeLeft}
      />
      <More instance={instance} users={ranking.users} totalPixels={ranking.totalPixels} user={userData} />
      <Canvas
        canvasSize={canvasSize}
      mapSize={mapSize} selectedPixel={selectedPixel} setSelectedPixel={setSelectedPixel} pixelMap={pixelMap} colors={colors}></Canvas>
      <Info colors={colors} name={userData.name} nbPixels={userData.nbPixels} timer={timeLeft} setTimer={setTimeLeft}
        selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>
      <div className="z-0 flex justify-center items-center fixed top-0 left-50 m-6">
          <img src="logo.png" alt="logo" className="w-14 me-3" />
          <h1 className="font-bold text-4xl font-worksansBold ">
            Tekplace
          </h1>
      </div>
    </div>
  );
}
