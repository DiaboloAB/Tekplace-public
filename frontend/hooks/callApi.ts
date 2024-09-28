interface CallApiProps {
    url: string;
    action: (data: any) => void;
}

const callApi = async ({ url, action }: CallApiProps, accounts: any, instance: any) => {
    const account = accounts[0];
    const accessToken = await instance.acquireTokenSilent({
      scopes: [process.env.NEXT_PUBLIC_API_SCOPE as string],
      account,
    });
    console.log(accessToken.accessToken);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
        console.log('API Response:', data);
        action(data);
    } else {
        console.error('API Error:', data);
        window.location.href = "/uhoh";
    }
};

export default callApi;