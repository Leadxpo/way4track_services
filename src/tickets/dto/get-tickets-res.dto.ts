import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";

export class GetTicketsResDto {
    staffId: number;
    staffName: string;
    staffNumber: string;
    reportingStaffId: number;
    reportingStaffName: string;
    reportingStaffNumber: string;
    problem: string;
    remark: string;
    date: Date;
    branchId: number;
    branchName: string;
    ticketNumber: string;
    companyCode: string;
    unitCOde: string;
    workStatus?: WorkStatusEnum;
    description?: string;
    subDealerId?: number
    subDealerName?: string
    designationRelation?: number
    designation?: string;
    subDealerStaffId?: number

    constructor(
        staffId: number,
        staffName: string,
        staffNumber: string,
        reportingStaffId: number,
        reportingStaffName: string,
        reportingStaffNumber: string,  
        problem: string,
        remark: string,
        date: Date,
        branchId: number,
        branchName: string,
        ticketNumber: string,
        // // addressingDepartment: AddressingDepartment,
        companyCode: string,
        unitCOde: string,
        workStatus?: WorkStatusEnum,
        description?: string,
        subDealerId?: number,
        subDealerName?: string,
        designationRelation?: number,
        designation?: string,
        subDealerStaffId?: number



    ) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.staffNumber = staffNumber;
        this.reportingStaffId = reportingStaffId;
        this.reportingStaffName = reportingStaffName;
        this.reportingStaffNumber = reportingStaffNumber;
        this.problem = problem;
        this.remark = remark;
        this.date = date;
        this.branchId = branchId;
        this.branchName = branchName;
        this.ticketNumber = ticketNumber;
        // this.addressingDepartment = addressingDepartment;
        this.companyCode = companyCode;
        this.unitCOde = unitCOde
        this.workStatus = workStatus
        this.description = description
        this.subDealerId = subDealerId
        this.subDealerName = subDealerName
        this.designationRelation = designationRelation
        this.designation = designation
        this.subDealerStaffId = subDealerStaffId
    }
}
