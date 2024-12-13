
export class RequestResDto {
    id: number;
    requestType: string;
    staffID: number;
    requestFor: string;
    requestBY: string;
    requestTo: string;
    description: string;
    createdDate: Date;
    branchId: number;
    branchName: string;

    constructor(
        id: number,
        requestType: string,
        staffID: number,
        requestFor: string,
        requestBY: string,
        requestTo: string,
        description: string,
        createdDate: Date,
        branchId: number,
        branchName: string
    ) {
        this.id = id;
        this.requestType = requestType;
        this.staffID = staffID;
        this.requestFor = requestFor;
        this.requestBY = requestBY;
        this.requestTo = requestTo;
        this.description = description;
        this.createdDate = createdDate;
        this.branchId = branchId;
        this.branchName = branchName;
    }
}
