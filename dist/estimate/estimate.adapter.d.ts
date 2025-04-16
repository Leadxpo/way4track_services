import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateEntity } from './entity/estimate.entity';
export declare class EstimateAdapter {
    convertDtoToEntity(dto: EstimateDto): EstimateEntity;
    convertEntityToResDto(entities: EstimateEntity[]): EstimateResDto[];
}
