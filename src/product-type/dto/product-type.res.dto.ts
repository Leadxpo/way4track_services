export class ProductTypeResponseDto {
    id: number;
    name: string;
    companyCode: string;
    unitCode: string;
    productPhoto: string
    blogImage: string;
    description: string
    constructor(
        id: number,
        name: string,
        companyCode: string,
        unitCode: string,
        productPhoto: string,
        blogImage: string,
        description: string
    ) {
        this.id = id;
        this.name = name;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.productPhoto = productPhoto;
        this.blogImage = blogImage
        this.description = description
    }
}
