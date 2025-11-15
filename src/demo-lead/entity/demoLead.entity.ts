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

    @Column("json", { name: "selected_products" })
    selectedProducts:[];
  
    @Column({ name: "total_products_selected", type: "int", nullable: true })
    totalProductsSelected: number;
  
    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

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
