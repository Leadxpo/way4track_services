import { EstimateDto } from './dto/estimate.dto';
import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateEntity } from './entity/estimate.entity';
export declare class EstimateAdapter {
    convertDtoToEntity(dto: EstimateDto): EstimateEntity;
    convertEntityToResDto(entity: EstimateEntity): EstimateResDto;
}
