import { useState, useEffect } from "react";

interface Pixel {
  x: number;
  y: number;
}

const useKeydown = (mapSize: Pixel, setSelectedPixel: React.Dispatch<React.SetStateAction<Pixel>>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setSelectedPixel((prev: Pixel) => {
        let newX = prev.x;
        let newY = prev.y;

        switch (event.key) {
          case "ArrowUp":
            newY = Math.max(0, prev.y - 1);
            break;
          case "ArrowDown":
            newY = Math.min(mapSize.y - 1, prev.y + 1);
            break;
          case "ArrowLeft":
            newX = Math.max(0, prev.x - 1);
            break;
          case "ArrowRight":
            newX = Math.min(mapSize.x - 1, prev.x + 1);
            break;
        }

        return { x: newX, y: newY };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mapSize, setSelectedPixel]);
};

export default useKeydown;