"use client";
import { useMsal } from "@azure/msal-react";

export default function Admin() {
    const { accounts } = useMsal();

    return (
        <div className="flex justify-center items-center h-screen bg-base-200">
            { accounts[0].username === process.env.NEXT_PUBLIC_ADMIN_EMAIL ?
                <div className="h-full container py-10">
                    <div className="bg-base-300 rounded container h-full p-3">
                        <div role="alert" className="alert alert-error fixed bottom-0 left-0 m-3 w-1/3 overflow-hidden">
                            <span className="material-symbols-outlined">info</span>
                            <span className="">Error! Task failed successfullysuccessfullysuccessfull</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold"> Admin Panel </span>
                            <button className="btn"  onClick={() => window.location.href = '/'}>
                                <span className="material-symbols-outlined">apps</span>
                            </button>
                        </div>
                        <div className="divider"></div>
                        <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr>
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Blue</td>
      </tr>
      {/* row 2 */}
      <tr>
        <th>2</th>
        <td>Hart Hagerty</td>
        <td>Desktop Support Technician</td>
        <td>Purple</td>
      </tr>
      {/* row 3 */}
      <tr>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Red</td>
      </tr>
    </tbody>
  </table>
</div>
                    </div>
                </div>
            :
                <span className="loading loading-spinner loading-md"></span>
            }
        </div>
    );
}
