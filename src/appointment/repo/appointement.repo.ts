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


    async getAllAppointmentDetails(req: { unitCode: string; companyCode: string; branch?: string, staffId?: string }) {
        const acceptedStatus = 'accepted';  // You can set this to whatever value is appropriate for the status
    
        const groupedBranches = await this.createQueryBuilder('appointment')
            .select([
                'branch.name AS branchName',
                'COUNT(appointment.id) AS totalAppointments',
                'SUM(CASE WHEN appointment.status = :accepted THEN 1 ELSE 0 END) AS totalSuccessAppointments'
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = appointment.branch_id')
            .where('appointment.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('appointment.unit_code = :unitCode', { unitCode: req.unitCode })
            .setParameter('accepted', acceptedStatus);
    
        if (req.branch) {
            groupedBranches.andWhere('branch.name = :branchName', { branchName: req.branch });
        }
    
        // Execute the groupedBranches query
        const result = await groupedBranches.groupBy('branch.name').getRawMany();
     
        const appointments = this.createQueryBuilder('appointment')
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
                'appointment.date AS date',
                'appointment.description AS description',
                'appointment.status AS status',
                'appointment.call_type AS callType',
                'appointment.service AS service',
                'appointment.image AS image',
                'staff.id AS staffId',
                'staff.name AS assignedTo',
                'cr_st.id AS createdById',
                'cr_st.name AS createdByName',
            ])
            .leftJoin(ClientEntity, 'client', 'appointment.client_id = client.id')
            .leftJoin(BranchEntity, 'branch', 'branch.id = appointment.branch_id')
            .leftJoin(StaffEntity, 'staff', 'staff.id = appointment.staff_id')
            .leftJoin(StaffEntity, 'cr_st', 'cr_st.id = appointment.created_by')
            .where('appointment.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('appointment.unit_code = :unitCode', { unitCode: req.unitCode });
    
        if (req.branch) {
            appointments.andWhere('branch.name = :branchName', { branchName: req.branch });
        }
    
        if (req.staffId) {
            appointments.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }
    
        const appointmentsResult = await appointments.orderBy('branch.name', 'ASC').getRawMany();
    
        return { result, appointments: appointmentsResult };
    }
    



}