import { StaffEntity } from './entity/staff.entity';
import { StaffDto } from './dto/staff.dto';
import { GetStaffResDto } from './dto/staff-res.dto';
export declare class StaffAdapter {
    convertDtoToEntity(dto: StaffDto): StaffEntity;
    convertEntityToDto(entity: StaffEntity[]): GetStaffResDto[];
}
