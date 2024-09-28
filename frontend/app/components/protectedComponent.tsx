import { useMsal } from '@azure/msal-react';
import callApi from '@/hooks/callApi';


const ProtectedComponent = () => {
  const { accounts, instance } = useMsal();

  return <button onClick={
    () => callApi({
      url: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/protected',
      action: (data: any) => console.log(data)
    }, accounts, instance
  )
  }>Call Protected API</button>;
};

export default ProtectedComponent;
