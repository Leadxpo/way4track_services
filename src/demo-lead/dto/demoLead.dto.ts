import { DemoLeadStatus, DemoLeadType, TimePeriodEnum } from "../entity/demoLead.entity";

export class DemoLeadDto {
  id?: number;
  clientName: string;
  clientPhoneNumber: string;
  clientEmail: string;
  clientAddress: string;
  demoLeadType: DemoLeadType;
  date: string;
  slot: string;
  period: TimePeriodEnum;
  description?: string;
  status?: DemoLeadStatus;
  demoLeadId?: string;
  companyCode: string;
  unitCode: string;
}
