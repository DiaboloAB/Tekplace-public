export type Point = { x: number; y: number; };

export type Pixel = {
    position: Point,
    color: number,
    name: string
};

export type MapProps = {
    canvasSize: Point;
    mapSize: Point;
    selectedPixel: Point;
    setSelectedPixel: (pixel: Point) => void;
    pixelMap: Pixel[];
    colors: string[];
};

export type DrawMapProps = {
    canvasSize: Point;
    mapSize: Point;
    selectedPixel: Point;
    setSelectedPixel: (pixel: Point) => void;
    pixelMap: Pixel[];
    colors: string[];
    context: CanvasRenderingContext2D,
    scale: number,
    offset: Point
};

export type UseMapProps = {
    mapSize: Point;
    canvasSize: Point;
    setSelectedPixel: (pixel: Point) => void;
};
