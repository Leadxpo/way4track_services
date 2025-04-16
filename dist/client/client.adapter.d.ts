import { ClientResDto } from './dto/client-res.dto';
import { ClientDto } from './dto/client.dto';
import { ClientEntity } from './entity/client.entity';
export declare class ClientAdapter {
    convertDtoToEntity(dto: ClientDto): ClientEntity;
    convertEntityToDto(entity: ClientEntity[]): ClientResDto[];
}
