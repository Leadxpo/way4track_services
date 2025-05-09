import { AmenitiesEntity } from 'src/amenities/entity/amenities-entity';
import { ApplicationEntity } from 'src/application/entity/application-entity';
import { BlogEntity } from 'src/blogs/entity/blog.entity';
import { DeviceEntity } from 'src/devices/entity/devices-entity';
import { ProductAppEntity } from 'src/product-app/entity/product-app.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity('website_product')
export class WebsiteProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ name: 'layout_type', type: 'varchar', length: 100, nullable: true })
    layoutType: string;

    @Column({ name: 'short_description', type: 'varchar', length: 225, nullable: true })
    shortDescription: string;

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

    @Column({ name: 'banner_1', type: 'varchar', length: 255, nullable: true })
    banner1: string;

    @Column({ name: 'banner_2', type: 'varchar', length: 255, nullable: true })
    banner2: string;

    @Column({ name: 'banner_3', type: 'varchar', length: 255, nullable: true })
    banner3: string;

    @Column({ name: 'home_banner', type: 'varchar', length: 255, nullable: true })
    homeBanner: string;

    @Column({ name: 'product_icon', type: 'varchar', length: 255, nullable: true })
    productIcon: string;

    @Column({ name: 'footer_banner', type: 'varchar', length: 255, nullable: true })
    footerBanner: string;

    @Column({ name: 'blog_image', type: 'varchar', length: 255, nullable: true })
    blogImage: string;

    @Column('json', { name: 'steps' })
    steps: {
        desc: string;
        title: string
    }[];

    @OneToMany(() => DeviceEntity, (staff) => staff.webProduct)
    device: DeviceEntity[];

    @OneToMany(() => BlogEntity, (staff) => staff.webProduct)
    Blog: BlogEntity[];

    @OneToMany(() => AmenitiesEntity, (staff) => staff.webProduct)
    amenities: AmenitiesEntity[];

    @OneToMany(() => ApplicationEntity, (staff) => staff.webProduct)
    application: ApplicationEntity[];

    @OneToMany(() => ProductAppEntity, (staff) => staff.webProduct)
    productApp: ProductAppEntity[];

    @Column({ name: 'product_type', type: 'varchar', length: 100, nullable: true })
    productType: string;

    @Column({ name: 'blog_title', type: 'varchar', length: 255, nullable: true })
    blogTitle: string;

    @Column({ name: 'choose_title', type: 'varchar', length: 255, nullable: true })
    chooseTitle: string;

    @Column({ name: 'choose_image', type: 'varchar', length: 255, nullable: true })
    chooseImage: string;

    @Column({ name: 'choose_description', type: 'text', nullable: true })
    chooseDescription: string;

    @Column('json', { name: 'points', nullable: true })
    points: {
        title: string;
        description: string;
    }[];

}
