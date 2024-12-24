import { ClientEntity } from './entity/client.entity';
import { ClientDto } from './dto/client.dto';
import { ClientResDto } from './dto/client-res.dto';
export declare class ClientAdapter {
    convertDtoToEntity(dto: ClientDto): ClientEntity;
    convertEntityToDto(entity: ClientEntity[]): ClientResDto[];
}
