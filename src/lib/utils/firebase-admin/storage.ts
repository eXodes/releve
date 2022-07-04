export const getPublicPath = (path: string) => {
    return process.env.STORAGE_BUCKET_URL + encodeURIComponent(path);
};
