import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestResDto } from './dto/request-res.dto';
import { RequestRaiseEntity } from './entity/request-raise.entity';
export declare class RequestRaiseAdapter {
    convertDtoToEntity(dto: RequestRaiseDto): RequestRaiseEntity;
    convertEntityToResDto(entity: RequestRaiseEntity): RequestResDto;
}
