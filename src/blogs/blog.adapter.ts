import { BlogResponseDto } from "./dto/blog-response.dto";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { BlogEntity } from "./entity/blog.entity";


export class BlogAdapter {
    toEntity(dto: CreateBlogDto): BlogEntity {
        const entity = new BlogEntity();
        entity.webProduct = { id: dto.webProductId } as any;
        entity.webProductName = dto.webProductName;
        entity.image = dto.image;
        entity.title = dto.title;
        entity.pdfFile = dto.pdfFile;
        entity.description = dto.description;
        return entity;
    }

    toResponseDto(entity: BlogEntity): BlogResponseDto {
        return {
            id: entity.id,
            webProductId: entity.webProduct?.id,
            webProductName: entity.webProductName,
            image: entity.image,
            title: entity.title,
            pdfFile: entity.pdfFile,
            description:entity.description
        };
    }
}
