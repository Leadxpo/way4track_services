import { StaffEntity } from 'src/staff/entity/staff.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('staff_letters')
export class LettersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { name: 'company_code', length: 200, nullable: true })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 200, nullable: true })
    unitCode: string;

    // @Column('varchar', { name: 'unit_code', length: 200, nullable: false })
    // staffId: string;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.Letters)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @Column('varchar', { name: 'offer_letter', nullable: true })
    offerLetter?: string;

    @Column('varchar', { name: 'resignation_letter', nullable: true })
    resignationLetter?: string;

    @Column('varchar', { name: 'termination_letter', nullable: true })
    terminationLetter?: string;

    @Column('varchar', { name: 'appointment_letter', nullable: true })
    appointmentLetter?: string;

    @Column('varchar', { name: 'leave_format', nullable: true })
    leaveFormat?: string;

    @Column('varchar', { name: 'relieving_letter', nullable: true })
    relievingLetter?: string;

    @Column('varchar', { name: 'experience_letter', nullable: true })
    experienceLetter?: string;
}
