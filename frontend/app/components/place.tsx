"use client";
type PlaceProps = {
    colors: string[],
    selectedPixel: { x: number, y: number },
    selectedPixelData: { color: number, name: string }
    selectedColor: number,
    placePixel: () => void,
    nbPixels: number,
    timer: number
};

const Place = (props: PlaceProps) => {

    return (
        <div className="fixed m-6 bottom-0 left-50 z-20">
                {props.selectedPixel.x === -1 ? null :
                <div className="rounded p-3 bg-base-300 mb-3 flex flex-col items-center justify-center w-64">
                    <span className="font-bold">
                        x:{props.selectedPixel.x} - y:{props.selectedPixel.y}
                        </span>
                    <span>{props.selectedPixelData.name}</span>
                    { props.nbPixels <= 0 ?
                        <button id="placeButton" className="btn btn-lg btn-disabled" onClick={props.placePixel}>
                            <span className="countdown items-center align-middle">
                                <span style={{ "--value": props.timer / 60 | 0 } as React.CSSProperties}></span>:
                                <span style={{ "--value": props.timer % 60 } as React.CSSProperties}></span>
                            </span>
                        </button>
                    :
                        <button id="placeButton" className="btn btn-lg" onClick={props.placePixel}>
                            <div className="badge badge-md" style={{ backgroundColor: props.colors[props.selectedColor] }}></div>Place
                        </button>
                    }
                </div>
                }

        </div>
    );
};

export default Place;