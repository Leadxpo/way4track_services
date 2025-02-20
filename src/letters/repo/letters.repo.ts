import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LettersEntity } from "../entity/letters.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";



@Injectable()

export class LettersRepository extends Repository<LettersEntity> {

    constructor(private dataSource: DataSource) {
        super(LettersEntity, dataSource.createEntityManager());
    }

    async getStaffLetters(req: { staffId?: string, companyCode: string, unitCode: string }) {


        const query = this.createQueryBuilder('permission')
            .select([
                'staff.staff_id AS staffId',
                'staff.name AS staffName',
                'staff.designation AS designation',
                'permission.offer_letter as offerLetter',
                'permission.resignation_letter as resignationLetter',
                'permission.termination_letter as terminationLetter',
                'permission.appointment_letter as appointmentLetter',
                'permission.leave_format as leaveFormat',
                'permission.relieving_letter as relievingLetter',
                'permission.experience_letter as experienceLetter'

            ])
            .leftJoin(StaffEntity, 'staff', 'staff.id = permission.staff_id')
            .where('permission.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('permission.unit_code = :unitCode', { unitCode: req.unitCode })
        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }

        const staffDetails = await query.getRawMany();
        return staffDetails;
    }

}