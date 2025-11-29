export class BlogResponseDto {
    id: number;
    webProductId: number;
    webProductName: string;
    image?: string;
    title?: string;
    pdfFile?: string;
    description?: string;
    constructor(id: number,
        webProductId: number,
        webProductName: string,
        image?: string,
        title?: string,
        pdfFile?: string,
        description?: string
    ) {
        this.id = id
        this.webProductId = webProductId
        this.webProductName = webProductName
        this.image = image
        this.title = title
        this.pdfFile = pdfFile
        this.description=description

    }
}
