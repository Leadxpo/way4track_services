import { DemoLeadStatus, DemoLeadType } from "../entity/demoLead.entity";

export class DemoLeadDto {
  id?: number;
  clientName: string;
  clientPhoneNumber: string;
  clientEmail: string;
  selectedProducts?: [];
  totalProductsSelected?: number;
  demoLeadType: DemoLeadType;
  description?: string;
  status?: DemoLeadStatus;
  demoLeadId?: string;
  
  companyCode: string;
  unitCode: string;
}
