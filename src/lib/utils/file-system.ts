import { readFileSync, readdir } from "fs";

export const getFile = (path?: string) => {
    if (!path) {
        return undefined;
    }

    return readFileSync(path, "utf8");
};

export const getFiles = (path: string) => {
    return new Promise<string[]>((resolve, reject) => {
        readdir(path, (err, files) => {
            if (err) {
                reject(err);
            }

            resolve(files);
        });
    });
};

export const getFileContent = (path: string) => {
    return readFileSync(path, "utf8");
};
