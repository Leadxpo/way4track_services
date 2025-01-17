import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum AddressingDepartment {
    CEO = 'CEO',
    HR = 'HR',
    Accountant = 'Accountant',
    Operator = 'Operator',
    WarehouseManager = 'Warehouse Manager',
    BranchManager = 'Branch Manager',
    SubDealer = 'Sub Dealer',
    Technician = 'Technician',
    SalesMan = 'Sales Man',
    CallCenter = 'Call Center',
}
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
        default: AddressingDepartment.CEO
    })
    addressingDepartment: AddressingDepartment;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
