export interface UpdateUserInformationDto {
    uid: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
}
