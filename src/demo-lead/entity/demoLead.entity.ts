import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';


export enum DemoLeadType {
    SERVICE = 'service',
    PRODUCT = 'product',
}

export enum DemoLeadStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    SENT = 'sent',
}
export enum TimePeriodEnum {
    AM = 'AM',
    PM = 'PM'
}
@Entity('demoLeads')
export class DemoLeadEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'demoLead_id',
        type: 'varchar',
        length: 50,
        unique: true,
    })
    demoLeadId: string;

    @Column({
        name: 'demoLead_type',
        type: 'enum',
        enum: DemoLeadType,
        default: DemoLeadType.PRODUCT
    })
    demoLeadType: DemoLeadType;

    @Column({ name: 'name', type: 'varchar', length: 200 })
    clientName: string;

    @Column({ name: 'phone', type: 'varchar', length: 100 })
    clientPhoneNumber: string;

    @Column({ name: 'email', type: 'varchar', length: 100 })
    clientEmail: string;

    @Column({ name: 'address', type: 'varchar', length: 100 })
    clientAddress: string;

    @Column({ name: 'date', type: 'date', nullable: true })
    date: string | null;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'time', type: 'time' })
    slot: string;

    @Column({ name: 'period', type: 'enum', enum: TimePeriodEnum,nullable:true })
    period: TimePeriodEnum;


    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: DemoLeadStatus,
        default: DemoLeadStatus.SENT,
    })
    status: DemoLeadStatus;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
