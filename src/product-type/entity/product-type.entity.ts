import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity('product_type')
export class ProductTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'product_photo', type: 'varchar', length: 100, nullable: true })
    productPhoto: string;

    @Column({ name: 'blog_image', type: 'varchar', length: 255, nullable: true })
    blogImage: string;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @OneToMany(() => ProductEntity, (product) => product.productTypeId)
    productType: ProductEntity[];

    @OneToMany(() => ProductAssignEntity, (product) => product.productTypeId)
    productAssign: ProductAssignEntity[];//desc,blog image
}
