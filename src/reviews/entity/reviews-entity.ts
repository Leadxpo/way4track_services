import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity('reviews')
export class ReviewEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'review', type: 'varchar', length: 100, nullable: true })
    review: string;

    @Column({ name: 'rating', type: 'int', nullable: true })
    rating: number;

    @Column('varchar', { name: 'review_by', length: 200, nullable: true })
    reviewBy: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'company_name', type: 'text', nullable: true })
    companyName: string;
}
