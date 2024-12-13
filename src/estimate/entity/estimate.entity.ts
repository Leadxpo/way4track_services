import { ClientEntity } from "src/client/entity/client.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('estimates')
export class EstimateEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.workAllocation)
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @Column({ type: 'varchar', length: 255, name: 'building_address' })
    buildingAddress: string;

    @Column({ type: 'date', name: 'estimate_date' })
    estimateDate: string;

    @Column({ type: 'varchar', name: 'estimate_id' })
    estimateId: string;

    @Column({ type: 'date', name: 'expire_date' })
    expireDate: string;

    @Column({ type: 'varchar', length: 100, name: 'product_or_service' })
    productOrService: string;

    @Column({ type: 'varchar', length: 255, name: 'description' })
    description: string;

    @Column({ type: 'float', name: 'amount' })
    amount: number;

    @Column('json', { nullable: true, name: 'products' })
    products: { name: string; quantity: number; hsnCode: string; amount: number }[];
}
