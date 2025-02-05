import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { HiringStatus } from '../enum/hiring-status.enum';
import { HiringLevel } from '../enum/hiring-level.enum';
import { DesignationEnum } from 'src/staff/entity/staff.entity';


@Entity('hiring')
export class HiringEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'hiring_level', type: 'enum', enum: HiringLevel, default: HiringLevel.LEVEL_1 })
    hiringLevel: HiringLevel;


    @Column({ name: 'candidate_name', type: 'varchar', length: 100 })
    candidateName: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 15 })
    phoneNumber: string;

    @Column({ name: 'email', type: 'varchar', length: 100 })
    email: string;

    @Column({ name: 'address', type: 'text' })
    address: string;

    @Column('json', { name: 'qualifications' })
    qualifications: {
        qualificationName: string; marks: number; yearOfPass: number
    }[];

    @Column('json', { name: 'level_wise_data', nullable: true })
    levelWiseData: {
        dateOfConductor: number,
        conductorBy: DesignationEnum.HR,
        conductorPlace: string,
        result: string,
        review: string,
    }[];

    @Column({ name: 'resume_path', type: 'varchar', nullable: true })
    resumePath: string;

    @Column({ name: 'date_of_upload', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateOfUpload: Date;

    @Column({ name: 'status', type: 'enum', enum: HiringStatus, default: HiringStatus.INTERVIEWED })
    status: HiringStatus;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
