import { AppointmentEntity } from './entity/appointement.entity';
import { AppointmentDto } from './dto/appointement.dto';
import { AppointmentResDto } from './dto/appointment-res.sto';
export declare class AppointmentAdapter {
    convertDtoToEntity(dto: AppointmentDto): AppointmentEntity;
    convertEntityToDto(entities: AppointmentEntity[]): AppointmentResDto[];
}
