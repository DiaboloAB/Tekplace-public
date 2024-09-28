"use client";

export default function Huho() {

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="flex flex-col items-center justify-center">
          <img src="uhoh.jpg" alt="logo" className="w-28 me-3" />
          <div>
            <span className="font-bold">Uhoh</span><br />
            <span>something went not good</span>
          </div>
          <button className="btn" onClick={() => window.location.href = '/'}>TRY RECONNECT</button>
        </div>
    </div>
  );
}
