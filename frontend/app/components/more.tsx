type MoreProps = {
    instance: any;
    users: any[];
    totalPixels: number;
    user: any;
}

export default function More(props: MoreProps) {
    const handleLogout = () => {
        // props.instance.logoutPopup().catch((error: any) => {
        //     console.error("Logout failed:", error);
        // });
        props.instance.logoutRedirect().catch((error: any) => {
            console.error("Logout failed:", error);
        });
    };

    return (
        <div className="fixed top-0 left-0 m-6 z-20">

            <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer" className="btn bg-base-300 p-3 drawer-button">
                        <span className="material-symbols-outlined" style={{ fontSize: "30px" }}>leaderboard</span>
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="menu p-4 w-96 bg-base-200 text-base-content flex flex-col  h-screen">
                        <div className="">
                            <div className="stats shadow w-full">
                                <div className="stat">
                                    <div className="stat-title">Total pixel placed</div>
                                    <div className="stat-value flex align-middle items-center">{props.totalPixels | 0}
                                    <img src="cube-spinning.gif" alt='pixel' className='h-8 ps-2' />
                                    </div>
                                    <div className="stat-desc">A total of
                                        <span className="font-bold"> {props.totalPixels * 5 / 60 | 0}h {props.totalPixels * 5 % 60 | 0}m </span>
                                        spent at tek</div>
                                </div>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="flex-1 overflow-y-auto">
                            <ul className="flex flex-col">
                                { props.users.length > 0 ?
                                    <li><a><span className="text-lg">🥇 {props.users[0].name} <span className="ps-2 text-2xl font-bold"> {props.users[0].totalPixels}px</span></span></a></li>
                                : null}
                                { props.users.length > 1 ?
                                    <li><a><span className="text-lg">🥈 {props.users[1].name} <span className="ps-2 text-xl font-bold"> {props.users[1].totalPixels}px</span></span></a></li>
                                : null}
                                { props.users.length > 2 ?
                                    <li><a><span className="text-lg">🥉 {props.users[2].name} <span className="ps-2 text-lg font-bold"> {props.users[2].totalPixels}px</span></span></a></li>
                                : null}
                                { props.users.length > 3 && props.users[2].totalPixels > props.user.totalPixels ?
                                    <li><a><span className="text-lg">{props.user.name} <span className="text-lg font-bold"> {props.user.totalPixels}px</span></span></a></li>
                                : null}
                                {props.users.length > 3 &&
                                    props.users.slice(3).map((user: any, index: number) => (
                                        <li key={index}><a><span className="text-lg">{user.name} <span className="text-lg font-bold"> {user.totalPixels}px</span></span></a></li>
                                    ))
                                }

                            </ul>
                        </div>
                        <div className="divider"></div>
                        <div className="">
                            <button className="btn btn-lg bg-base-300" onClick={handleLogout}>
                                <img src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_mssymbol_19.png" alt="Microsoft" />
                                <span className='font-bold ps-4'>Log Out</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};
