import { StaffStatus } from "src/staff/enum/staff-status";

export class SubDealerDto {
  id?: number;
  name: string;
  subDealerPhoneNumber: string;
  alternatePhoneNumber?: string;
  gstNumber: string;
  startingDate: Date;
  emailId: string;
  aadharNumber: string;
  address: string;
  // voucherId: number;
  companyCode?: string;
  unitCode?: string
  subDealerId?: string
  password: string
  subDealerPhoto?: string;
  branchId?: number;
  status?: StaffStatus;

}
