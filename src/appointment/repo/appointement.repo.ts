import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AppointmentEntity } from "../entity/appointement.entity";
import { AppointmentResDto } from "../dto/appointment-res.sto";
import { CommonReq } from "src/models/common-req";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";


@Injectable()

export class AppointmentRepository extends Repository<AppointmentEntity> {

    constructor(private dataSource: DataSource) {
        super(AppointmentEntity, dataSource.createEntityManager());
    }

    // async getAllAppointmentDetails(req: CommonReq, branch?: string) {
    //     const groupedBranches = await this.createQueryBuilder('appointment')
    //         .select([
    //             'branch.name AS branchName',
    //             'COUNT(appointment.id) AS totalAppointments',
    //         ])
    //         .leftJoin('appointment.branchId', 'branch')
    //         .where(`appointment.company_code = "${req.companyCode}"`)
    //         .andWhere(`appointment.unit_code = "${req.unitCode}"`)
    //     if (branch) {
    //         groupedBranches.andWhere('branch.name = :branchName', { branchName: branch });
    //     }
    //     const result = await groupedBranches.groupBy('branch.name').getRawMany();



    //     const appointments = await this.createQueryBuilder('appointment')
    //         .select([
    //             'appointment.id',
    //             'appointment.name',
    //             'client.id AS clientId',
    //             'client.name AS clientName',
    //             'client.phone_number AS clientPhoneNumber',
    //             'client.address AS clientAddress',
    //             'branch.id AS branchId',
    //             'branch.name AS branchName',
    //             'appointment.appointment_type AS appointmentType',
    //             'appointment.slot AS slot',
    //             'appointment.description AS description',
    //             'appointment.status AS status',
    //             'staff.id AS staffId',
    //             'staff.name AS assignedTo',
    //         ])
    //         .leftJoin('appointment.clientId', 'client')
    //         .leftJoin('appointment.branchId', 'branch')
    //         .leftJoin('appointment.staffId', 'staff')
    //         .where(`appointment.company_code = "${req.companyCode}"`)
    //         .andWhere(`appointment.unit_code = "${req.unitCode}"`)
    //     if (branch) {
    //         appointments.andWhere('br.name = :branchName', { branchName: branch });
    //     }
    //     await appointments.orderBy('branch.name', 'ASC').getRawMany();


    //     return { result, appointments };
    // }

    async getAllAppointmentDetails(req: CommonReq, branch?: string) {
        const groupedBranches = await this.createQueryBuilder('appointment')
            .select([
                'branch.name AS branchName',
                'COUNT(appointment.id) AS totalAppointments',
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = appointment.branch_id')
            // Ensure correct alias
            .where('appointment.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('appointment.unit_code = :unitCode', { unitCode: req.unitCode });

        if (branch) {
            groupedBranches.andWhere('branch.name = :branchName', { branchName: branch });
        }

        const result = await groupedBranches.groupBy('branch.name').getRawMany();

        const appointments = await this.createQueryBuilder('appointment')
            .select([
                'appointment.id AS appointment_id',
                'appointment.name AS appointment_name',
                'client.id AS clientId',
                'client.name AS clientName',
                'client.phone_number AS clientPhoneNumber',
                'client.address AS clientAddress',
                'branch.id AS branchId',
                'branch.name AS branchName',
                'appointment.appointment_type AS appointmentType',
                'appointment.time AS slot',
                'appointment.description AS description',
                'appointment.status AS status',
                'staff.id AS staffId',
                'staff.name AS assignedTo',
            ])
            .leftJoin(ClientEntity, 'client', 'appointment.client_id = client.id')
            .leftJoin(BranchEntity, 'branch', 'branch.id = appointment.branch_id')
            .leftJoin(StaffEntity, 'staff', 'staff.id = appointment.staff_id')
            .where('appointment.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('appointment.unit_code = :unitCode', { unitCode: req.unitCode });

        if (branch) {
            appointments.andWhere('branch.name = :branchName', { branchName: branch });
        }

        const appointmentsResult = await appointments.orderBy('branch.name', 'ASC').getRawMany();

        return { result, appointments: appointmentsResult };
    }


}