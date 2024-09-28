import { DrawMapProps } from '@/types/map';

export function drawMap({ props }: { props: DrawMapProps }) {
    const { context, offset, scale, mapSize, pixelMap, colors, selectedPixel } = props;

        const offset2 = {
            x: offset.x - mapSize.x * scale / 2,
            y: offset.y - mapSize.y * scale / 2,
        };
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      context.fillStyle = "white";
      context.fillRect(
        offset2.x,
        offset2.y,
        mapSize.x * scale,
        mapSize.y * scale
    );

    if (selectedPixel.x !== -1 && selectedPixel.y !== -1) {
    context.strokeStyle = "black";
    context.strokeRect(
        offset2.x + selectedPixel.x * scale,
        offset2.y + selectedPixel.y * scale,
    scale,
        scale
    );
    }
    for (const pixel of pixelMap) {
        context.fillStyle = colors[pixel.color];
        context.fillRect(
            offset2.x + pixel.position.x * scale,
            offset2.y + pixel.position.y * scale,
            scale,
            scale
        );
    }
}
