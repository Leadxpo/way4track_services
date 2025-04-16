import { ProductAssignDto } from './dto/product-assign.dto';
import { ProductAssignEntity } from './entity/product-assign.entity';
export declare class ProductAssignAdapter {
    convertDtoToEntity(dto: ProductAssignDto): ProductAssignEntity;
    calculateNumberOfProducts(imeiFrom: string, imeiTo: string): number;
}
