import { DemoLeadStatus, DemoLeadType } from "../entity/demoLead.entity";

export class DemoLeadResDto {
  id: number;
  clientName: string;
  clientPhoneNumber: string;
  clientEmail: string;

  demoLeadType: DemoLeadType;
  selectedProducts: [];
  totalProductsSelected: number;

  description: string;
  status: DemoLeadStatus;
  demoLeadId: string;

  companyCode: string;
  unitCode: string;

  constructor(
    id: number,
    clientName: string,
    clientPhoneNumber: string,
    clientEmail: string,
    demoLeadType: DemoLeadType,
    selectedProducts: [],
    totalProductsSelected: number,
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

    this.demoLeadType = demoLeadType;
    this.selectedProducts = selectedProducts;
    this.totalProductsSelected = totalProductsSelected;

    this.description = description;
    this.status = status;
    this.demoLeadId = demoLeadId;

    this.companyCode = companyCode;
    this.unitCode = unitCode;
  }
}
