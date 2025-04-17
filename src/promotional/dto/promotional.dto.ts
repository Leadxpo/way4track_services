// src/promotion/dto/create-promotion.dto.ts
export class CreatePromotionDto {
    id?: number;
    name?: string;
    header?: string;
    shortDescription?: string;
    theme?: string;
    image?: string;
    list: { photo?: string; desc: string }[];
}
