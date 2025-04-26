import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { HiringStatus } from '../enum/hiring-status.enum';
import { HiringLevel } from '../enum/hiring-level.enum';
import { YesNo } from 'src/staff/entity/staff.entity';

export enum InterviewWith {
    Sunil = "Sunil",
    Ashok = 'Ashok',
    HR = "HR"
}
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
        dateOfConductor: string,
        conductorBy: InterviewWith.HR,
        conductorPlace: string,
        result: string,
        review: string,
        type?: string,
    }[];

    @Column({ name: 'resume_path', type: 'varchar', nullable: true })
    resumePath: string;

    @Column({ name: 'joining_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    joiningDate: string;

    @Column({ name: 'notice_period', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    noticePeriod: string;

    @Column({ name: 'date_of_upload', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateOfUpload: Date;

    @Column({ name: 'status', type: 'enum', enum: HiringStatus, default: HiringStatus.PENDING })
    status: HiringStatus;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'driving_licence_number', type: 'varchar', length: 100, nullable: true })
    drivingLicenceNumber: string;

    @Column({ name: 'driving_licence', type: 'enum', enum: YesNo, default: YesNo.NO })
    drivingLicence: YesNo;
}
