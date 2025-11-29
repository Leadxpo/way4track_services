export class CreateBlogDto {
    id?: number;
    webProductId: number;
    webProductName: string;
    image?: string;
    title?: string;
    pdfFile?: string;
    description?: string; 
}
