import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { DiscountTypeEnum,promoStatusEnum } from "../entity/promo.entity";

export class PromocodeDto {
    id?: number;
    promocode: string;
    date: Date;
    discount: number;
    discountType: DiscountTypeEnum;
    companyCode: string;
    unitCode: string;
    promoUsers: WorkStatusEnum;
    minSaleAmount: number;
    maxDiscountAmount?:number
    promoStatus?:promoStatusEnum
}
