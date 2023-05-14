import { STORAGE_API, STORAGE_BUCKET } from "$env/static/private";

export const getPublicPath = (path: string) => {
    const filePath = encodeURIComponent(path);
    return `${STORAGE_API}/${STORAGE_BUCKET}/${filePath}`;
};
