import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AppointmentEntity } from "../entity/appointement.entity";
import { AppointmentResDto } from "../dto/appointment-res.sto";


@Injectable()

export class AppointmentRepository extends Repository<AppointmentEntity> {

    constructor(private dataSource: DataSource) {
        super(AppointmentEntity, dataSource.createEntityManager());
    }

    async getAllAppointmentDetails() {
        const appointments = await this.createQueryBuilder('appointment')
            .select([
                'appointment.id AS id',
                'appointment.name AS name',
                'client.id AS clientId',
                'client.name AS clientName',
                'client.phone AS clientPhoneNumber',
                'client.address AS clientAddress',
                'branch.id AS branchId',
                'branch.name AS branchName',
                'appointment.appointmentType AS appointmentType',
                'appointment.slot AS slot',
                'appointment.description AS description',
                'appointment.status AS status',
                'staff.id AS staffId',
                'staff.name AS assignedTo',
            ])
            .leftJoin('appointment.clientId', 'client')
            .leftJoin('appointment.branchId', 'branch')
            .leftJoin('appointment.staffId', 'staff')
            .orderBy('branch.name', 'ASC')
            .getRawMany();


        return appointments.map(
            (appointment) =>
                new AppointmentResDto(
                    appointment.id,
                    appointment.name,
                    appointment.clientPhoneNumber,
                    appointment.clientId,
                    appointment.clientAddress,
                    appointment.clientName,
                    appointment.branchId,
                    appointment.branchName,
                    appointment.appointmentType,
                    appointment.staffId,
                    appointment.assignedTo,
                    appointment.slot,
                    appointment.description,
                    appointment.status,
                    appointment.appointmentId
                ),
        );
    }

}