import { DemoLeadStatus, DemoLeadType, TimePeriodEnum } from "../entity/demoLead.entity";

export class DemoLeadResDto {
    id: number;
    clientName: string;
    clientPhoneNumber: string;
    clientAddress: string;
    clientEmail: string;
    demoLeadType: DemoLeadType;
    date: string;
    slot: string;
    period: TimePeriodEnum
    description: string;
    status: DemoLeadStatus;
    demoLeadId: string;
    companyCode: string;
    unitCode: string

    constructor(
        id: number,
        clientName: string,
        clientPhoneNumber: string,
        clientEmail: string,
        clientAddress: string,
        demoLeadType: DemoLeadType,
        date: string,
        slot: string,
        period: TimePeriodEnum,
        description: string,
        status: DemoLeadStatus,
        demoLeadId: string,
        companyCode: string,
        unitCode: string,
    ) {
        this.id = id;
        this.clientName = clientName;
        this.clientPhoneNumber = clientPhoneNumber;
        this.clientEmail = clientEmail;
        this.clientAddress = clientAddress;
        this.demoLeadType = demoLeadType;
        this.date = date;
        this.slot = slot;
        this.period = period;
        this.description = description;
        this.status = status;
        this.demoLeadId = demoLeadId;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
