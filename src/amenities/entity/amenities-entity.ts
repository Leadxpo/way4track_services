import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WebsiteProductEntity } from 'src/website-product/entity/website-entity';

@Entity('amenities')
export class AmenitiesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => WebsiteProductEntity, (staff) => staff.amenities, { nullable: true })
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
}



