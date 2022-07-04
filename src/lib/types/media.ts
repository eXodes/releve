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
