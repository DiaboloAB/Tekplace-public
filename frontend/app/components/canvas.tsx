import React, { useEffect } from "react";
import { MapProps } from "@/types/map";
import { useMap } from "@/hooks/useMap";
import { drawMap } from "./drawMap";

export default function Canvas(props: MapProps) {

    const { canvasRef, context, scale, offset, handleMouseMove, handleZoom, handleMouseDown, handleMouseUp } =
    useMap({ props });

    useEffect(() => {
        if (context) {
            drawMap({ props: { ...props, context, scale, offset } });
        }
    }, [context, scale, offset, props.pixelMap, props.selectedPixel, props]);

    const selectPixel = (event: MouseEvent) => {
        const mousePosCanvas = {
            x: event.clientX - canvasRef.current!.getBoundingClientRect().left - window.innerWidth / 2 + props.mapSize.x * scale / 2,
            y: event.clientY - canvasRef.current!.getBoundingClientRect().top - window.innerHeight / 2 + props.mapSize.y * scale / 2,
        };
        const selectedPixel = {
            x: Math.floor((mousePosCanvas.x - offset.x + window.innerWidth / 2) / scale),
            y: Math.floor((mousePosCanvas.y - offset.y + window.innerHeight / 2) / scale),
        };
        if (selectedPixel.x < 0 || selectedPixel.x >= props.mapSize.x || selectedPixel.y < 0 || selectedPixel.y >= props.mapSize.y) {
            props.setSelectedPixel({ x: -1, y: -1 });
            return;
        }
        props.setSelectedPixel(selectedPixel);
    }

    const handleMouseDownCombined = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        handleMouseDown(event.nativeEvent);
        selectPixel(event.nativeEvent);
    };

    return (
        <div className="fixed z-10">
            <canvas
                ref={canvasRef}
                onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
                onWheel={(e) => handleZoom(e.nativeEvent)}
                onMouseDown={(e) => handleMouseDownCombined(e)}
                onMouseUp={() => handleMouseUp()}
                style={{
                    width: `${props.canvasSize.x}px`,
                    height: `${props.canvasSize.y}px`,
                }}
            ></canvas>
        </div>
    );
}
