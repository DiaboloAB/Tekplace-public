import { useRef, useState, useCallback, useEffect } from "react";
import { Point, ORIGIN, diffPoints, addPoints, scalePoint } from "@/utils/geometry";
import { UseMapProps } from "@/types/map";


export function useMap({props}: {props: UseMapProps}) {
    const canvasWidth = props.canvasSize.x;
    const canvasHeight = props.canvasSize.y;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [scale, setScale] = useState(4);
  const [offset, setOffset] = useState<Point>(ORIGIN);
  const lastMousePosRef = useRef<Point>(ORIGIN);
  const isMousePressedRef = useRef(false);
  const mouseMovement = useRef<Point>(ORIGIN);

  const resetCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
    setContext(ctx);
    setScale(4);
    setOffset({
        x: canvasWidth / 2,
        y: canvasHeight / 2,
    });
  }, [canvasWidth, canvasHeight]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    isMousePressedRef.current = true;
    lastMousePosRef.current = { x: event.clientX, y: event.clientY };
    mouseMovement.current = ORIGIN;
  }, []);

  const handleMouseUp = useCallback(() => {
    isMousePressedRef.current = false;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (context && isMousePressedRef.current) {
        const currentMousePos = { x: event.clientX, y: event.clientY };
        mouseMovement.current = diffPoints(lastMousePosRef.current, currentMousePos);
        lastMousePosRef.current = currentMousePos;
        setOffset((prevOffset) => addPoints(prevOffset, {
            x: -mouseMovement.current.x,
            y: -mouseMovement.current.y,
        }));
    }
  }, [context]);

    const handleZoom = useCallback((event: WheelEvent) => {
        const ZOOM_SENSITIVITY = 600;
        const zoomFactor = 1 - event.deltaY / ZOOM_SENSITIVITY;
        setScale((prevScale) => Math.min(Math.max(prevScale * zoomFactor, 2), 16));
    }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) resetCanvas(ctx);
    }
  }, [resetCanvas]);

  return {
    canvasRef,
    context,
    scale,
    offset,
    handleMouseMove,
    handleZoom,
    handleMouseDown,
    handleMouseUp,
  };
}
