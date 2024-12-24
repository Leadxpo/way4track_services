import { WorkAllocationEntity } from './entity/work-allocation.entity';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationResDto } from './dto/work-allocation-res.dto';
export declare class WorkAllocationAdapter {
    convertDtoToEntity(dto: WorkAllocationDto): WorkAllocationEntity;
    convertEntityToDto(entities: WorkAllocationEntity[]): WorkAllocationResDto[];
}
