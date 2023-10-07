import { camelCase } from "lodash-es";

export const getFormData = <T extends { [p: string]: FormDataEntryValue | FormDataEntryValue[] }>(
    formData: FormData
): T => {
    const data: { [p: string]: FormDataEntryValue | FormDataEntryValue[] } = {};

    for (const key of formData.keys()) {
        const isArray = key.indexOf("[]") !== -1;

        const dataKey = camelCase(key);
        const dataValue = isArray ? formData.getAll(key) : formData.get(key);

        if (dataValue) {
            data[dataKey] = dataValue;
        }
    }

    return data as T;
};

export const getBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

export const getFileData = async (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

export const getFileFromUrl = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new File([blob], filename, {
        type: blob.type,
        lastModified: Date.now(),
    });
};
