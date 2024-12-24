import { VendorDto } from './dto/vendor.dto';
import { VendorEntity } from './entity/vendor.entity';
import { VendorResDto } from './dto/vendor-res.dto';
export declare class VendorAdapter {
    convertDtoToEntity(dto: VendorDto): VendorEntity;
    convertEntityToDto(entity: VendorEntity[]): VendorResDto[];
}
