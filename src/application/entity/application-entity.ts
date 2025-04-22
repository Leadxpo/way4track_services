import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WebsiteProductEntity } from 'src/website-product/entity/website-entity';

@Entity('application')
export class ApplicationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => WebsiteProductEntity, (staff) => staff.application, { nullable: true })
    @JoinColumn({ name: 'web_product_id' })
    webProduct: WebsiteProductEntity;

    @Column({ name: 'web_product_name', type: 'varchar', length: 100, nullable: true })
    webProductName: string;

    @Column({ name: 'image', type: 'varchar', length: 100, nullable: true })
    image: string;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ name: 'desc', type: 'varchar', length: 255, nullable: true })
    desc: string;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false, })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false, })
    unitCode: string;
}



