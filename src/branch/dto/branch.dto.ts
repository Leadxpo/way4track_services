export class BranchDto {
    id: number;
    branchName: string;
    branchNumber: string;
    managerName: string;
    branchAddress?: string;
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    branchOpening?: Date;
    email: string;
    branchPhoto?: string;
}