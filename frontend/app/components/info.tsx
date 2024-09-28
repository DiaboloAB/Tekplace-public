type InfoProps = {
    colors: string[];
    name: string;
    nbPixels: number;
    selectedColor: number;
    setSelectedColor: (color: number) => void;
    timer: number;
    setTimer: (timer: number) => void;
};

export default function Info(props: InfoProps) {
    return (
        <div className="fixed top-0 right-0 m-6 flex flex-col items-end z-20">
            <div className="flex items-center">
                <div className="dropdown">
                    <button  tabIndex={0} className="btn btn-circle me-3 bg-base-300 btn-outline">
                        <span className="material-symbols-outlined" style={{ color: props.colors[props.selectedColor] }}
                        >palette</span>
                    </button>
                    <div tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-60 p-2 shadow">
                        <div>
                            {props.colors.map((color, index) => (
                                <button className="btn btn-md btn-circle m-1" key={index} onClick={() => props.setSelectedColor(index)}
                                 style={{ backgroundColor: color }}>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="rounded p-3 bg-base-300">
                    <span className="text-lg font-bold">{props.name}</span>
                    <div className="text-2xl font-bold flex items-center">
                        <span>
                            {props.nbPixels}
                            /15</span>
                        <img
                            src="cube-spinning.gif"
                            alt='pixel' className='h-8 px-2' />
                        { props.timer <= 0 ?
                            <span className="countdown items-center align-middle">
                                <span style={{ "--value": 0 } as React.CSSProperties}></span>:
                                <span style={{ "--value": 0 } as React.CSSProperties}></span>
                            </span>
                            :
                            <span className="countdown items-center align-middle">
                                <span style={{ "--value": props.timer / 60 | 0 } as React.CSSProperties}></span>:
                                <span style={{ "--value": props.timer % 60 } as React.CSSProperties}></span>
                            </span>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}