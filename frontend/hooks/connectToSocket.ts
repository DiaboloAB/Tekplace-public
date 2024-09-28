import io from "socket.io-client";

let connected = false;
let socket: any = null;

const connectToSocket = async (
    accounts: any,
    instance: any,
    setTimer: any,
    setUserData: any,
    setPixelMap: any,
    pixelMap: any) => {
    if (connected) return;
    connected = true;
    console.log("Connecting to WebSocket server...");
    const account = accounts[0];
    const accessToken = await instance.acquireTokenSilent({
        scopes: [process.env.NEXT_PUBLIC_API_SCOPE as string],
        account,
    });

    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string
        , {
        extraHeaders: {
            Authorization: `Bearer ${accessToken.accessToken}`,
          }
    });

    socket.on("connect", () => {
        console.log("Connected to WebSocket server");
    });

    socket.on("updatePixelsBatch", (data: any) => {
        console.log("updatePixelsBatch:", data);
        for (const pixel of data) {
            const index = pixelMap.findIndex((p: any) => p.position.x === pixel.position.x && p.position.y === pixel.position.y);
            if (index !== -1) {
                setPixelMap((prevPixelMap: any) => {
                    const newPixelMap = prevPixelMap.slice();
                    newPixelMap[index] = pixel;
                    return newPixelMap;
                });
            } else {
                setPixelMap((prevPixelMap: any) => {
                    const newPixelMap = prevPixelMap.slice();
                    newPixelMap.push(pixel);
                    return newPixelMap;
                });
            }
        }
    });

    socket.on("updatePixel", (data: { nbPixels: number,
        timeLeftForPixel: number
     }) => {
        console.log("Received updatePixel event:", data);
        setTimer(Math.floor(data.timeLeftForPixel));
        setUserData((prevUserData: any) => {
            return {
                ...prevUserData,
                nbPixels: data.nbPixels,
            };
        });
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
        window.location.href = "/uhoh";
    });

    socket.on("error", (error: any) => {
        console.error("Error from WebSocket server:", error);
        window.location.href = "/uhoh";
    });
};

const emitEvent = (event: string, data: any) => {
    if (socket && socket.connected) {
        console.log("Emitting event:", event, data);
        socket.emit(event, data);
    } else {
        console.error("Socket is not connected");
    }
};

export { connectToSocket, emitEvent };