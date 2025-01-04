import { AccountType } from "../entity/account.entity";

export class AccountResDto {
    id?: number;
    name: string;
    accountType: AccountType;
    accountNumber: string;
    ifscCode: string;
    phoneNumber: string;
    address: string;
    companyCode: string;
    unitCode: string;
    branchId: number;
    branchName: string;
    accountName: string;
    totalAmount: number;
}
