import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { ProductORApplicationType } from '../dto/product-type.dto';
import { ClientStatus } from 'src/client/enum/client-status.enum';


@Entity('product_type')
export class ProductTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    // @Column({ name: 'product_photo', type: 'varchar', length: 100, nullable: true })
    // productPhoto: string;



    @Column('varchar', { name: 'company_code', length: 200, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 200, nullable: false })
    unitCode: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // @Column({ name: 'description', type: 'text', nullable: true })
    // description: string;

    @OneToMany(() => ProductEntity, (product) => product.productTypeId)
    productType: ProductEntity[];

    @OneToMany(() => TechnicianWorksEntity, (product) => product.applicationId)
    technician: TechnicianWorksEntity[];

    @OneToMany(() => ProductAssignEntity, (product) => product.productTypeId)
    productAssign: ProductAssignEntity[];//desc,blog image

    @Column({
        name: 'type',
        type: 'enum',
        enum: ProductORApplicationType,
        nullable: true,
        default: ProductORApplicationType.PRODUCT, // optional
    })
    type: ProductORApplicationType;

    @Column({ name: 'status', type: 'enum', enum: ClientStatus, default: ClientStatus.Active, nullable: true })
    status: ClientStatus

}
