import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerEntity } from './entity/sub-dealer.entity';
import { SubDealerResDto } from './dto/sub-dealer-res.dto';
export declare class SubDealerAdapter {
    convertDtoToEntity(dto: SubDealerDto): SubDealerEntity;
    convertEntityToDto(entity: SubDealerEntity[]): SubDealerResDto[];
}
