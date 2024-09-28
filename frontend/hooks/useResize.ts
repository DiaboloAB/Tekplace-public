import { useEffect, useState } from "react";

const useResize = () => {
  const [canvasSize, setCanvasSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        x: window.innerWidth,
        y: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return canvasSize;
};

export default useResize;