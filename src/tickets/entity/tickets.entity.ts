import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { WorkStatusEnum } from 'src/work-allocation/enum/work-status-enum';
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

    @ManyToOne(() => StaffEntity, (branchEntity) => branchEntity.tickets, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staff: StaffEntity;

    @Column({ name: 'problem', type: 'text', nullable: true })
    problem: string;

    @Column({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.tickets)
    @JoinColumn({ name: 'branch_id' })
    branch: BranchEntity;

    @Column({ name: 'ticket_number', type: 'varchar', length: 50, unique: true })
    ticketNumber: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: WorkStatusEnum, name: 'work_status', default: WorkStatusEnum.PENDING, nullable: true })
    workStatus: WorkStatusEnum;

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

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
