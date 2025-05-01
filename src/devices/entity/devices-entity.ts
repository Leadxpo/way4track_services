import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { WebsiteProductEntity } from 'src/website-product/entity/website-entity';
import { CartEntity } from 'src/cart/entity/cart.entity';

@Entity('device')
export class DeviceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => WebsiteProductEntity, (staff) => staff.device, { nullable: false })
    @JoinColumn({ name: 'web_product_id' })
    webProduct: WebsiteProductEntity;

    @Column({ name: 'web_product_name', type: 'varchar', length: 100, nullable: false })
    webProductName: string;

    @Column({ name: 'image', type: 'varchar', length: 200, nullable: true })
    image: string;

    @Column({ name: 'model', type: 'varchar', length: 255, nullable: true })
    model: string;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false, })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false, })
    unitCode: string;

    @OneToMany(() => CartEntity, (voucher) => voucher.device)
    cart: CartEntity[];
}



