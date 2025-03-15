import { ClientEntity } from 'src/client/entity/client.entity';
import { GroupsEntity } from 'src/groups/entity/groups.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

export enum RegistrationType {
    UNKNOWN = 'unknown',
    COMPOSITION = 'composition',
    REGULAR = 'regular',
    UNREGISTERED = 'unregistered',
}

@Entity({ name: 'ledgers' })
export class LedgerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, name: "name" })
    name: string;

    @Column({ length: 100, name: "state" })
    state: string;

    @Column({ length: 100, name: "country" })
    country: string;

    @Column({ length: 10, unique: true, nullable: true, name: "pan_number" })
    panNumber: string;

    @Column({ name: 'tds_deductable', type: 'boolean', nullable: false })
    tdsDeductable: boolean;

    @Column({ name: 'tcs_deductable', type: 'boolean', nullable: false })
    tcsDeductable: boolean;

    @Column({ type: 'enum', enum: RegistrationType, default: RegistrationType.UNKNOWN, name: 'registration_type' })
    registrationType: RegistrationType;

    @Column({ length: 15, unique: true, nullable: true, name: "gst_uin_number" })
    gstUinNumber: string;

    @ManyToOne(() => ClientEntity, (client) => client.ledger, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @ManyToOne(() => VendorEntity, (VendorEntity) => VendorEntity.ledger, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendorId: VendorEntity;

    @ManyToOne(() => SubDealerEntity, (SubDealerEntity) => SubDealerEntity.ledger, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealerId: SubDealerEntity;

    @Column('varchar', { length: 255, nullable: true, name: "group" })
    group: string;

    @ManyToOne(() => GroupsEntity, (GroupsEntity) => GroupsEntity.ledger, { nullable: true })
    @JoinColumn({ name: 'group_id' })
    groupId: GroupsEntity;

    @OneToMany(() => VoucherEntity, (voucher) => voucher.ledgerId)
    voucher: VoucherEntity[];

    @Column({ name: 'company_code', type: 'varchar', length: 20, nullable: false })
    companyCode: string;

    @Column({ name: 'unit_code', type: 'varchar', length: 20, nullable: false })
    unitCode: string;
}
