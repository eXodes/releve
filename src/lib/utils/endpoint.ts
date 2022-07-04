import { dev } from "$app/env";
import { parse } from "cookie";

export type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

interface EndpointOptions {
    method: "GET" | "DELETE";
    headers?: HeadersInit;
    fetch?: Fetch;
    data?: undefined;
    body?: undefined;
}

interface EndpointOptionsData<T> {
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    fetch?: Fetch;
    data: T;
    body?: undefined;
}

interface EndpointOptionsBody {
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    fetch?: Fetch;
    data?: undefined;
    body: BodyInit;
}

type Options<T> = EndpointOptions | EndpointOptionsData<T> | EndpointOptionsBody;

export const getCookie = (headers: Headers, key: string) => {
    const cookies = parse(headers.get("cookie") || "");

    const sessionCookie = cookies[key];

    if (!sessionCookie) throw new Error("Session cookie not found.");

    return sessionCookie;
};

export const endpoint = async <ReturnType = void, DataType = undefined>(
    resource: string,
    options?: Options<DataType>
): Promise<ReturnType> => {
    const fetcher = options?.fetch ?? fetch;

    const response = await fetcher(resource, {
        method: options?.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...options?.headers,
        },
        body: options?.data ? JSON.stringify(options?.data) : options?.body,
    });

    if (!dev) if (response.status === 500) throw Error(response.statusText);

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);

    return data as ReturnType;
};
