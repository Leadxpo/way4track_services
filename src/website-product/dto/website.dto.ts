export class WebsiteProductDto {
    id?: number;
    name: string;
    layoutType: string;
    shortDescription: string;
    companyCode: string;
    unitCode: string;
    description: string;
    banner1?: string;
    banner2?: string;
    banner3?: string;
    homeBanner?: string;
    footerBanner: string;
    blogImage?: string;
    steps: {
        desc: string;
        title: string;
    }[];

    productType: string;
    blogTitle: string;
    chooseTitle: string;
    chooseImage: string;
    chooseDescription: string;
    points: {
        title: string;
        description: string;
    }[];
    productIcon: string;

}