import type { File as StorageFile, GetSignedUrlResponse, SaveOptions } from "@google-cloud/storage";

import { getStorage } from "firebase-admin/storage";

export interface MediaImage<T = number> {
    url: string;
    width: T;
    height: T;
    alt?: string;
}

export interface Media {
    small: MediaImage<200>;
    medium: MediaImage<500>;
    large: MediaImage<1200>;
}

interface Storage<T> {
    addFile(path: string, file: File): Promise<void>;
    getFile(path: string): Promise<StorageFile>;
    getPublicUrl(path: string): Promise<T>;
    getPublicPath(path: string): T;
}

export abstract class MediaStorage implements Storage<Media> {
    protected readonly bucket = getStorage().bucket(process.env.STORAGE_BUCKET);
    protected readonly bucketUrl = process.env.STORAGE_BUCKET_URL;

    protected config = {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    };

    private getSignedSmall = async (path: string): Promise<GetSignedUrlResponse> => {
        const file = await this.getFile(path, 200);

        return file.getSignedUrl({
            action: "read",
            expires: this.config.expires,
        });
    };

    private getSignedMedium = async (path: string): Promise<GetSignedUrlResponse> => {
        const file = await this.getFile(path, 500);

        return file.getSignedUrl({
            action: "read",
            expires: this.config.expires,
        });
    };

    private getSignedLarge = async (path: string): Promise<GetSignedUrlResponse> => {
        const file = await this.getFile(path, 1200);

        return file.getSignedUrl({
            action: "read",
            expires: this.config.expires,
        });
    };

    async addFile(path: string, file: File, option?: SaveOptions): Promise<void> {
        const bucketFile = this.bucket.file(path);

        const buffer = Buffer.from(await file.arrayBuffer());

        await bucketFile.save(buffer, {
            public: true,
            contentType: file.type,
            ...option,
        });
    }

    async getFile(path: string, size: 200 | 500 | 1200 = 500): Promise<StorageFile> {
        const file = this.bucket.file(path + `_${size}x${size}`);

        if (!(await file.exists())) {
            throw new Error(`File ${path} with ${size}x${size} does not exist`);
        }

        return file;
    }

    async getPublicUrl(path: string): Promise<Media> {
        const [url_small] = await this.getSignedSmall(path + "_200x200");
        const [url_medium] = await this.getSignedMedium(path + "_500x500");
        const [url_large] = await this.getSignedLarge(path + "_1200x1200");

        return {
            small: {
                url: url_small,
                width: 200,
                height: 200,
            },
            medium: {
                url: url_medium,
                width: 500,
                height: 500,
            },
            large: {
                url: url_large,
                width: 1200,
                height: 1200,
            },
        };
    }

    getPublicPath(path: string): Media {
        const small = this.bucketUrl + encodeURIComponent(path + `_200x200`);
        const medium = this.bucketUrl + encodeURIComponent(path + `_500x500`);
        const large = this.bucketUrl + encodeURIComponent(path + `_1200x1200`);

        return {
            small: {
                url: small,
                width: 200,
                height: 200,
            },
            medium: {
                url: medium,
                width: 500,
                height: 500,
            },
            large: {
                url: large,
                width: 1200,
                height: 1200,
            },
        };
    }
}
