export interface AccountDto {
  id: number;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export class EstimateResDto {
  id: number;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhoneNumber: string;
  clientGST: string;
  branchId: number;
  branchName: string;
  branchAddress: string;
  branchEmail: string;
  branchPhoneNumber: string;
  branchGST: string;
  branchCIN: string;
  branchAccount: AccountDto | null;
  accountId: string;
  buildingAddress: string;
  shippingAddress: string;
  taxableState: string;
  supplyState: string;
  estimateDate: Date;
  expireDate: string;
  productOrService: string;
  description: string;
  totalAmount: number;
  companyCode: string;
  unitCode: string;
  products?: {
    type?: string;
    productId?: number;
    name: string;
    quantity: number;
    costPerUnit: number;
    totalCost: number;
    hsnCode: string;
    description:string;
  }[];
  estimateId?: string;
  invoiceId?: string;
  prefix?: string;
  invoicePrefix?: string;
  isGST?: boolean;
  isTDS?: boolean;
  SCST?: number;
  CGST?: number;
  TDS?: number;
  vendorId?: number;
  vendorName?: string;
  vendorPhoneNumber?: string;
  estimatePdfUrl: string;
  invoicePdfUrl: string;
  createdBy: number;
  createdByName: string;
constructor(
    id: number,
    clientId: string,
    clientName: string,
    clientAddress: string,
    clientEmail: string,
    clientPhoneNumber: string,
    clientGST: string,
    branchId: number,
    branchName: string,
    branchAddress: string,
    branchEmail: string,
    branchPhoneNumber: string,
    branchGST: string,
    branchCIN: string,
    branchAccount: AccountDto | null,
    accountId: string,
    buildingAddress: string,
    shippingAddress: string,
    taxableState: string,
    supplyState: string,
    estimateDate: Date,
    expireDate: string,
    productOrService: string,
    description: string,
    totalAmount: number,
    companyCode: string,
    unitCode: string,
    products?: {
      type?: string;
      productId?: number;
      name: string;
      quantity: number;
      costPerUnit: number;
      totalCost: number;
      hsnCode: string;
      description:string;
    }[],
    estimateId?: string,
    invoiceId?: string,
    prefix?: string,
    invoicePrefix?: string,
    isGST?: boolean,
    isTDS?: boolean,
    SCST?: number,
    CGST?: number,
    TDS?: number,
    vendorId?: number,
    vendorName?: string,
    vendorPhoneNumber?: string,
    estimatePdfUrl?: string,
    invoicePdfUrl?: string,
    createdBy?: number,
    createdByName?: string

  ) {
    this.id = id;
    this.clientId = clientId;
    this.clientName = clientName;
    this.clientAddress = clientAddress;
    this.clientEmail = clientEmail;
    this.clientPhoneNumber = clientPhoneNumber;
    this.clientGST = clientGST;
    this.branchId = branchId;
    this.branchName = branchName;
    this.branchAddress = branchAddress;
    this.branchEmail = branchEmail;
    this.branchPhoneNumber = branchPhoneNumber;
    this.branchGST = branchGST;
    this.branchCIN = branchCIN;
    this.branchAccount = branchAccount;
    this.accountId = accountId;
    this.buildingAddress = buildingAddress;
    this.shippingAddress = shippingAddress;
    this.taxableState = taxableState;
    this.supplyState = supplyState;
    this.estimateDate = estimateDate;
    this.expireDate = expireDate;
    this.productOrService = productOrService;
    this.description = description;
    this.totalAmount = totalAmount;
    this.companyCode = companyCode;
    this.unitCode = unitCode;
    this.products = products;
    this.estimateId = estimateId;
    this.invoiceId = invoiceId;
    this.prefix = prefix;
    this.invoicePrefix = invoicePrefix;
    this.isGST = isGST;
    this.isTDS = isTDS;
    this.SCST = SCST;
    this.CGST = CGST;
    this.TDS = TDS;
    this.vendorId = vendorId;
    this.vendorName = vendorName;
    this.vendorPhoneNumber = vendorPhoneNumber;
    this.estimatePdfUrl = estimatePdfUrl ?? '';
    this.invoicePdfUrl = invoicePdfUrl ?? '';
    this.createdBy = createdBy ?? null;
    this.createdByName = createdByName ?? '';
  }
}
