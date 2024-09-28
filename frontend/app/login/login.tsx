"use client";
import { useMsal } from "@azure/msal-react";

function Login() {

    const { instance } = useMsal();

    const handleLogin = () => {
        // instance.loginPopup({
        //     scopes: ['api://ba9dcad1-3628-4f39-879a-1699d63483d9/access_as_user'],
        // }).then(response => {
        //     console.log('Access Token:', response.accessToken);
        // }).catch(error => {
        //     console.error(error);
        // });

        instance.loginRedirect({
            scopes: ['api://ba9dcad1-3628-4f39-879a-1699d63483d9/access_as_user'],
        }).catch(error => {
            console.error(error);
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <main className="flex flex-col items-center">
                <div className="flex justify-center items-center pb-6">
                    <img src="logo.png" alt="logo" className="w-14 me-3" />
                    <h1 className="font-bold text-4xl font-worksansBold ">
                        Tekplace
                    </h1>
                </div>
                <button className="btn btn-lg bg-base-300" onClick={handleLogin}>
                    <img src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_mssymbol_19.png" alt="Microsoft" />
                    <span className='font-bold ps-4'>Sign In</span>
                </button>
            </main>
        </div>
    )
}

export default Login;