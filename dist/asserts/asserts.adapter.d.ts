import { AssertsEntity } from "./entity/asserts-entity";
import { GetAssertsResDto } from "./dto/get-asserts-res.dto";
import { AssertsDto } from "./dto/asserts.dto";
export declare class AssertsAdapter {
    convertEntityToDto(entity: AssertsEntity): GetAssertsResDto;
    convertDtoToEntity(dto: AssertsDto): AssertsEntity;
}
