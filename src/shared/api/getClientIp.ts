type IpResponse = {
    ip: string;
};

const IP_REQUEST_TIMEOUT = 2000;

let cachedIpPromise: Promise<string | null> | null = null;

const requestClientIp = async (): Promise<string | null> => {
    const serviceUrl = process.env.NEXT_PUBLIC_CLIENT_IP_SERVICE_URL;

    if (!serviceUrl) {
        return null;
    }

    try {
        const response = await fetch(serviceUrl, {
            signal: AbortSignal.timeout(IP_REQUEST_TIMEOUT),
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        const data: IpResponse = await response.json();

        return typeof data.ip === 'string' && data.ip.trim() ? data.ip.trim() : null;
    } catch {
        return null;
    }
};

export const getClientIp = (): Promise<string | null> => {
    if (process.env.NEXT_PUBLIC_CLIENT_IP_ENABLED !== 'true') {
        return Promise.resolve(null);
    }

    if (!cachedIpPromise) {
        cachedIpPromise = requestClientIp();
    }

    return cachedIpPromise;
};
