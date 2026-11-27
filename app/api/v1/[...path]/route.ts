import { requestServerApi } from '@/shared/api/server';

const UPSTREAM_TIMEOUT_MS = 30_000;
const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD']);
const FORWARDED_REQUEST_HEADERS = [
    'accept',
    'accept-language',
    'authorization',
    'content-type',
    'cookie',
    'user-agent',
    'x-recaptcha-token',
    'x-recaptcha-type',
];
const HOP_BY_HOP_HEADERS = [
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
];

type ApiRouteContext = {
    params: Promise<{ path: string[] }>;
};

const createUpstreamHeaders = (request: Request): Headers => {
    const headers = new Headers();

    FORWARDED_REQUEST_HEADERS.forEach(name => {
        const value = request.headers.get(name);

        if (value) headers.set(name, value);
    });

    const clientIpHeader = process.env.NEXT_PUBLIC_CLIENT_IP_HEADER;
    const clientIp = clientIpHeader ? request.headers.get(clientIpHeader) : null;

    if (clientIpHeader && clientIp) {
        headers.set(clientIpHeader, clientIp);
    }

    return headers;
};

const createClientHeaders = (headers: Headers, setCookies: string[]): Headers => {
    const clientHeaders = new Headers(headers);

    HOP_BY_HOP_HEADERS.forEach(header => clientHeaders.delete(header));
    clientHeaders.delete('set-cookie');

    setCookies.forEach(cookie => {
        const hostOnlyCookie = cookie.replace(/;\s*Domain=[^;]+/gi, '');

        clientHeaders.append('set-cookie', hostOnlyCookie);
    });

    return clientHeaders;
};

const proxyApiRequest = async (
    request: Request,
    context: ApiRouteContext,
): Promise<Response> => {
    const apiUrl = process.env.SERVER_API_URL;

    if (!apiUrl) {
        return Response.json({ error: 'Backend is not configured' }, { status: 503 });
    }

    try {
        const { path } = await context.params;
        const requestUrl = new URL(request.url);
        const encodedPath = path.map(segment => encodeURIComponent(segment)).join('/');
        const upstreamUrl = new URL(`/api/v1/${encodedPath}${requestUrl.search}`, apiUrl);
        const body = METHODS_WITHOUT_BODY.has(request.method)
            ? undefined
            : Buffer.from(await request.arrayBuffer());
        const signal = AbortSignal.any([
            request.signal,
            AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        ]);
        const upstream = await requestServerApi(upstreamUrl, {
            body,
            headers: createUpstreamHeaders(request),
            method: request.method,
            signal,
        });

        const responseBody =
            upstream.body.byteLength > 0 ? Uint8Array.from(upstream.body).buffer : null;

        return new Response(responseBody, {
            headers: createClientHeaders(upstream.headers, upstream.setCookies),
            status: upstream.status,
            statusText: upstream.statusText,
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[API proxy] Upstream request failed', {
            errorName: error instanceof Error ? error.name : 'UnknownError',
            errorMessage: error instanceof Error ? error.message : String(error),
        });

        return Response.json({ error: 'Backend is unavailable' }, { status: 502 });
    }
};

export const GET = proxyApiRequest;
export const POST = proxyApiRequest;
export const PUT = proxyApiRequest;
export const PATCH = proxyApiRequest;
export const DELETE = proxyApiRequest;
export const HEAD = proxyApiRequest;
export const OPTIONS = proxyApiRequest;
