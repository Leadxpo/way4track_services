import { CommonReq } from "src/models/common-req";
import { AccountType } from "../entity/account.entity";

export class AccountDto extends CommonReq {
    id?: number;
    name: string;
    accountType: AccountType;
    accountNumber: string;
    branchId?: number;
    ifscCode: string;
    phoneNumber: string;
    address: string;
    accountName: string;
    totalAmount: number;
}
