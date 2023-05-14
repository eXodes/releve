import type { File as StorageFile } from "@google-cloud/storage";

export interface Storage<T> {
    uploadFile(path: string, file: File): Promise<void>;
    getFile(path: string): Promise<StorageFile>;
    getPublicUrl(path: string): Promise<T>;
}
