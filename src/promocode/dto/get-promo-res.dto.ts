import { DiscountTypeEnum } from '../entity/promo.entity';

export class GetPromoResDto {
  id: number;
  promocode?: string;
  date: Date;
  discount: number;
  discountType: DiscountTypeEnum;
  minSaleAmount?: number;
  maxDiscountAmount?: number;
  promoUsers?: string;
  companyCode: string;
  unitCode: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    promocode: string | undefined,
    date: Date,
    discount: number,
    discountType: DiscountTypeEnum,
    minSaleAmount: number | undefined,
    maxDiscountAmount: number | undefined,
    promoUsers: string | undefined,
    companyCode: string,
    unitCode: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.promocode = promocode;
    this.date = date;
    this.discount = discount;
    this.discountType = discountType;
    this.minSaleAmount = minSaleAmount;
    this.maxDiscountAmount = maxDiscountAmount;
    this.promoUsers = promoUsers;
    this.companyCode = companyCode;
    this.unitCode = unitCode;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
