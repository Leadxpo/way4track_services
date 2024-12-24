export class SubDealerIdDto {
  subDealerId: string;
  companyCode?: string;
  unitCode?: string
  constructor(subDealerId: string, companyCode?: string,
    unitCode?: string) {
    this.subDealerId = subDealerId;
    this.companyCode = companyCode
    this.unitCode = unitCode
  }
}
