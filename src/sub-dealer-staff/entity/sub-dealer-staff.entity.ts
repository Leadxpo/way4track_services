import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}


@Entity('sub_dealer_staff')
export class SubDelaerStaffEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name: string;

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

    @Column({ name: 'gender', type: 'enum', enum: Gender })
    gender: Gender;

    @Column({ name: 'dob', type: 'date', nullable: true })
    dob: Date;

    @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 15, nullable: true })
    phoneNumber: string;

    @Column({ name: 'alternate_number', type: 'varchar', length: 15, nullable: true })
    alternateNumber: string;

    @Column({ name: 'staff_id', type: 'varchar', unique: true })
    staffId: string;

    @Column({ name: 'password', type: 'varchar' })
    password: string;

    @Column({ name: 'aadhar_number', type: 'varchar', length: 200, unique: true, nullable: true })
    aadharNumber: string;

    @Column({ name: 'pan_card_number', type: 'varchar', length: 200, unique: true, nullable: true })
    panCardNumber: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string;

    @ManyToOne(() => SubDealerEntity, (SubDealerEntity) => SubDealerEntity.subDealerStaff, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealerId: SubDealerEntity;
}

