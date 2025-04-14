import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity('service_type')
export class ServiceTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ name: 'duration', type: 'varchar', length: 100, nullable: true })
    duration: string;

    @Column('varchar', { name: 'company_code', length: 200, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 200, nullable: false })
    unitCode: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @OneToMany(() => TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.serviceId)
    technician: TechnicianWorksEntity[];
}
