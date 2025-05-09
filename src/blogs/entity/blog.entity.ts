import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { WebsiteProductEntity } from 'src/website-product/entity/website-entity';
import { CartEntity } from 'src/cart/entity/cart.entity';

@Entity('Blog')
export class BlogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => WebsiteProductEntity, (staff) => staff.Blog, { nullable: false })
    @JoinColumn({ name: 'web_product_id' })
    webProduct: WebsiteProductEntity;

    @Column({ name: 'web_product_name', type: 'varchar', length: 100, nullable: false })
    webProductName: string;

    @Column({ name: 'image', type: 'varchar', length: 200, nullable: true })
    image: string;

    @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
    title: string;

    @Column({ name: 'pdf_file', type: 'varchar', nullable: true })
    pdfFile: string;
}



