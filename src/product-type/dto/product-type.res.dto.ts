import { ClientStatus } from "src/client/enum/client-status.enum";
import { ProductORApplicationType } from "./product-type.dto";

export class ProductTypeResponseDto {
    id: number;
    name: string;
    companyCode: string;
    unitCode: string;
    type: ProductORApplicationType;
    status: ClientStatus

    // productPhoto: string
    // blogImage: string;
    // description: string
    constructor(
        id: number,
        name: string,
        companyCode: string,
        unitCode: string,
        type: ProductORApplicationType,
        status: ClientStatus

        // productPhoto: string,
        // blogImage: string,
        // description: string
    ) {
        this.id = id;
        this.name = name;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.type = type
        this.status = status
        // this.productPhoto = productPhoto;
        // this.blogImage = blogImage
        // this.description = description
    }
}
