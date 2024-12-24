import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AppointmentEntity } from "../entity/appointement.entity";
import { AppointmentResDto } from "../dto/appointment-res.sto";
import { CommonReq } from "src/models/common-req";


@Injectable()

export class AppointmentRepository extends Repository<AppointmentEntity> {

    constructor(private dataSource: DataSource) {
        super(AppointmentEntity, dataSource.createEntityManager());
    }

    async getAllAppointmentDetails(req: CommonReq) {
        const groupedBranches = await this.createQueryBuilder('appointment')
            .select([
                'branch.name AS branchName',
                'COUNT(appointment.id) AS totalAppointments',
            ])
            .leftJoin('appointment.branchId', 'branch')
            .where(`appointment.company_code = "${req.companyCode}"`)
            .andWhere(`appointment.unit_code = "${req.unitCode}"`)
            .groupBy('branch.name')
            .orderBy('branch.name', 'ASC')
            .getRawMany();

        const appointments = await this.createQueryBuilder('appointment')
            .select([
                'appointment.id',
                'appointment.name',
                'client.id AS clientId',
                'client.name AS clientName',
                'client.phone_number AS clientPhoneNumber',
                'client.address AS clientAddress',
                'branch.id AS branchId',
                'branch.name AS branchName',
                'appointment.appointment_type AS appointmentType',
                'appointment.slot AS slot',
                'appointment.description AS description',
                'appointment.status AS status',
                'staff.id AS staffId',
                'staff.name AS assignedTo',
            ])
            .leftJoin('appointment.clientId', 'client')
            .leftJoin('appointment.branchId', 'branch')
            .leftJoin('appointment.staffId', 'staff')
            .where(`appointment.company_code = "${req.companyCode}"`)
            .andWhere(`appointment.unit_code = "${req.unitCode}"`)
            .orderBy('branch.name', 'ASC')
            .getRawMany();

        return { groupedBranches, appointments };
    }

}