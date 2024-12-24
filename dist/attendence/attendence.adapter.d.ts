import { CreateAttendanceDto, GetAttendanceDto } from './dto/attendence.dto';
import { AttendanceEntity } from './entity/attendence.entity';
export declare class AttendanceAdapter {
    toEntity(dto: CreateAttendanceDto): AttendanceEntity;
    toDto(attendance: AttendanceEntity): GetAttendanceDto;
}
