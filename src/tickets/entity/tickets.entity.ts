import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AddressingDepartment } from '../enum/tickets.enum';

@Entity('tickets')
export class TicketsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StaffEntity, { eager: true })
    @JoinColumn({ name: 'staff_id' })
    staff: StaffEntity;

    @Column({ name: 'problem', type: 'text' })
    problem: string;

    @Column({ name: 'date', type: 'date' })
    date: Date;

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.tickets)
    @JoinColumn({ name: 'branch_id' })
    branch: BranchEntity;

    @Column({ name: 'ticket_number', type: 'varchar', length: 50, unique: true })
    ticketNumber: string;

    @Column({
        name: 'addressing_department',
        type: 'enum',
        enum: AddressingDepartment,
        nullable: false,
    })
    addressingDepartment: AddressingDepartment;
}
