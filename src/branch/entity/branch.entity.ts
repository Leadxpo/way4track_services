import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { AssertsEntity } from 'src/asserts/entity/asserts-entity';
import { AttendanceEntity } from 'src/attendence/entity/attendence.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('branches')
export class BranchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  branchName: string;

  @Column({ name: 'branch_number', type: 'varchar', length: 20 })
  branchNumber: string;

  @Column({ name: 'manager_name', type: 'varchar', length: 255 })
  managerName: string;

  @Column({ name: 'branch_address', type: 'text', nullable: true })
  branchAddress: string;

  @Column({ name: 'address_line1', type: 'varchar', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'address_line2', type: 'varchar', length: 255, nullable: true })
  addressLine2: string;

  @Column({ name: 'city', type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'state', type: 'varchar', length: 100 })
  state: string;

  @Column({ name: 'pincode', type: 'varchar', length: 10 })
  pincode: string;

  @Column({ name: 'branch_opening', type: 'datetime', nullable: true })
  branchOpening: Date;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'branch_photo', type: 'text', nullable: true })
  branchPhoto: string;

  @OneToMany(() => AssertsEntity, (asserts) => asserts.branchId)
  asserts: AssertsEntity[];

  @OneToMany(() => ClientEntity, (asserts) => asserts.branch)
  client: ClientEntity[];

  @OneToMany(() => StaffEntity, (asserts) => asserts.branch)
  staff: StaffEntity[];

  @OneToMany(() => AttendanceEntity, (asserts) => asserts.branchId)
  attendance: AttendanceEntity[];

  @OneToMany(() => ProductAssignEntity, (asserts) => asserts.branchId)
  productAssign: ProductAssignEntity[];

  @OneToMany(() => VoucherEntity, (voucherEntity) => voucherEntity.branchId)
  voucher: VoucherEntity[];

  @OneToMany(() => AppointmentEntity, (appointmentEntity) => appointmentEntity.branchId)
  appointment: AppointmentEntity[];

  @OneToMany(() => RequestRaiseEntity, (RequestRaiseEntity) => RequestRaiseEntity.branchId)
  request: RequestRaiseEntity[];

  @OneToMany(() => TicketsEntity, (ticketsEntity) => ticketsEntity.branch)
  tickets: TicketsEntity[];
}
