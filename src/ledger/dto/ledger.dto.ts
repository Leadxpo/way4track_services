import { RegistrationType } from "../entity/ledger.entity";


export class LedgerDto {
    id?: number
    name: string;
    state: string;
    country: string
    panNumber?: string;
    registrationType: RegistrationType;
    gstUinNumber?: string;
    clientId?: string
    vendorId?: number
    subDealerId?: number
    groupId?: number
    group: string
    tdsDeductable?: boolean;
    tcsDeductable: boolean;
    companyCode: string;
    unitCode: string;
}
