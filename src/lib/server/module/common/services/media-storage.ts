import { STORAGE_BUCKET, STORAGE_API } from "$env/static/private";

import app from "$server/services/firebase-admin";
import type { Storage } from "$module/common/contract/storage";

import type { Media } from "$client/types/media";

import type { File as StorageFile, GetSignedUrlResponse, SaveOptions } from "@google-cloud/storage";
import { getStorage } from "firebase-admin/storage";

export abstract class MediaStorage implements Storage<Media> {
    protected readonly bucket = getStorage(app).bucket(STORAGE_BUCKET);
    protected readonly bucketPublicUrl = `${STORAGE_API}/${STORAGE_BUCKET}`;

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

    private getPublicSmall = async (path: string): Promise<string> => {
        const file = await this.getFile(path, 200);

        return file.publicUrl();
    };

    private getPublicMedium = async (path: string): Promise<string> => {
        const file = await this.getFile(path, 500);

        return file.publicUrl();
    };

    private getPublicLarge = async (path: string): Promise<string> => {
        const file = await this.getFile(path, 1200);

        return file.publicUrl();
    };

    async uploadFile(path: string, file: File, option?: SaveOptions): Promise<void> {
        const bucketFile = this.bucket.file(path);

        const buffer = Buffer.from(await file.arrayBuffer());

        await bucketFile.save(buffer, {
            contentType: file.type,
            resumable: false,
            ...option,
        });
    }

    async getFile(path: string, size: 200 | 500 | 1200 = 500): Promise<StorageFile> {
        const file = this.bucket.file(path + `_${size}x${size}`);

        const [exists] = await file.exists();

        if (!exists) {
            throw new Error(`File ${path} with ${size}x${size} does not exist.`);
        }

        return file;
    }

    async getPublicUrl(path: string): Promise<Media> {
        const urlSmall = await this.getPublicSmall(path);
        const urlMedium = await this.getPublicMedium(path);
        const urlLarge = await this.getPublicLarge(path);

        return {
            small: {
                url: urlSmall,
                width: 200,
                height: 200,
            },
            medium: {
                url: urlMedium,
                width: 500,
                height: 500,
            },
            large: {
                url: urlLarge,
                width: 1200,
                height: 1200,
            },
        };
    }
}
