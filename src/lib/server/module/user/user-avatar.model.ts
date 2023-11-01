import { getFileFromUrl } from "$client/utils/data";
import { MediaStorage } from "$module/common/services/media-storage";

import { getMd5Hash } from "$client/utils/generator";
import type { Media, MediaImage } from "$client/types/media";

export class UserAvatar extends MediaStorage {
    private path: string;

    constructor(private uid: string) {
        super();
        this.path = `avatar/${this.uid}/`;
    }

    private static getSmallGravatar(str: string): MediaImage<200> {
        const url = new URL(`https://www.gravatar.com/avatar/${getMd5Hash(str)}`);
        url.searchParams.set("s", "200");
        url.searchParams.set("d", "retro");

        return {
            url: url.href,
            width: 200,
            height: 200,
        };
    }

    private static getMediumGravatar(str: string): MediaImage<500> {
        const url = new URL(`https://www.gravatar.com/avatar/${getMd5Hash(str)}`);
        url.searchParams.set("s", "500");
        url.searchParams.set("d", "retro");

        return {
            url: url.href,
            width: 500,
            height: 500,
        };
    }

    private static getLargeGravatar(str: string): MediaImage<1200> {
        const url = new URL(`https://www.gravatar.com/avatar/${getMd5Hash(str)}`);
        url.searchParams.set("s", "1200");
        url.searchParams.set("d", "retro");

        return {
            url: url.href,
            width: 1200,
            height: 1200,
        };
    }

    static async getGravatarUrl(uid: string): Promise<Media> {
        const media = new UserAvatar(uid);

        const file = await getFileFromUrl(UserAvatar.getMediumGravatar(uid).url, `${uid}.png`);
        await media.addAvatar(file);

        return {
            small: this.getSmallGravatar(uid),
            medium: this.getMediumGravatar(uid),
            large: this.getLargeGravatar(uid),
        };
    }

    async addAvatar(file: File): Promise<void> {
        await super.uploadFile(this.path + this.uid, file, {
            public: true,
        });
    }

    async getAvatarUrl(): Promise<Media> {
        try {
            return super.getPublicUrl(this.path + this.uid);
        } catch {
            return UserAvatar.getGravatarUrl(this.uid);
        }
    }
}
