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

    constructor(
        id: number | undefined,
        name: string,
        accountType: AccountType,
        accountNumber: string,
        ifscCode: string,
        phoneNumber: string,
        address: string,
        companyCode: string,
        unitCode: string,
        branchId: number,
        branchName: string,
        accountName: string,
        totalAmount: number
    ) {
        this.id = id;
        this.name = name;
        this.accountType = accountType;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.branchId = branchId;
        this.branchName = branchName;
        this.accountName = accountName;
        this.totalAmount = totalAmount;
    }
}
