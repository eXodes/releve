import md5 from "md5";

export const createUuid = () => {
    return crypto.randomUUID();
};

export const getMd5Hash = (str: string) => {
    return md5(str.trim().toLowerCase());
};

export const getGravatarURL = (email: string, size?: number) => {
    const hash = getMd5Hash(email);

    return `https://www.gravatar.com/avatar/${hash}?d=retro&s=${size || 200}`;
};
