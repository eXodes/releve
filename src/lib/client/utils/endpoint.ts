import { dev } from "$app/environment";
import { deserialize } from "$app/forms";

import type { MetaQuery } from "$client/types/meta";
import { getAppCheckToken } from "$client/utils/app-check";

import { redirect } from "@sveltejs/kit";

export type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface FetcherQuery<Query = MetaQuery> {
    query?: Query;
    fetch?: Fetch;
}

interface EndpointOptions {
    method: "GET" | "DELETE";
    headers?: HeadersInit;
    fetch?: Fetch;
    data?: undefined;
    body?: undefined;
}

interface EndpointOptionsBody {
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    fetch?: Fetch;
    data?: undefined;
    body?: BodyInit;
}

interface EndpointOptionsData<T> {
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    fetch?: Fetch;
    data: T;
    body?: undefined;
}

interface EndpointOptionsForm {
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    fetch?: Fetch;
    body?: FormData;
}

type Options<T = unknown> = EndpointOptions | EndpointOptionsData<T> | EndpointOptionsBody;

export const endpoint = async <ReturnType = void, DataType = undefined>(
    resource: string,
    options?: Options<DataType>
): Promise<ReturnType> => {
    const fetcher = options?.fetch ?? fetch;

    const token = await getAppCheckToken();

    const response = await fetcher(resource, {
        method: options?.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Firebase-AppCheck": token ?? "",
            ...options?.headers,
        },
        body: options?.data ? JSON.stringify(options?.data) : options?.body,
    });

    if (!dev) if (response.status === 500) throw Error(response.statusText);

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);

    return data as ReturnType;
};

export const formEndpoint = async <ReturnType = void>(
    resource: string,
    options?: EndpointOptions | EndpointOptionsForm
): Promise<ReturnType> => {
    const fetcher = options?.fetch ?? fetch;

    const token = await getAppCheckToken();

    const response = await fetcher(resource, {
        method: options?.method ?? "GET",
        headers: {
            "Accept": "application/json",
            "X-Firebase-AppCheck": token ?? "",
            ...options?.headers,
        },
        body: options?.body,
    });

    if (!dev) if (response.status === 500) throw Error(response.statusText);

    const result = deserialize(await response.text());

    if (result.type === "error") throw new Error(result.error.message);

    if (result.type === "redirect") redirect(303, result.location);

    return result.data as ReturnType;
};
