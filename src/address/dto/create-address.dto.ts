export class CreateAddressDto {
    id?: number;
    name?: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    city?: string;
    pincode?: string;
    addressLineOne?: string;
    addressLineTwo?: string;
    clientId?: number;
    companyCode: string;
    unitCode: string;
}
