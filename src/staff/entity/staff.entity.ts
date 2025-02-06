import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { AttendanceEntity } from 'src/attendence/entity/attendence.entity';
import { NotificationEntity } from 'src/notifications/entity/notification.entity';
import { PermissionEntity } from 'src/permissions/entity/permissions.entity';

export enum DesignationEnum {
  CEO = 'CEO',
  HR = 'HR',
  Accountant = 'Accountant',
  Operator = 'Operator',
  WarehouseManager = 'Warehouse Manager',
  BranchManager = 'Branch Manager',
  SubDealer = 'Sub Dealer',
  Technician = 'Technician',
  SalesMan = 'Sales Man',
  CallCenter = 'Call Center',
}


@Entity('staffs')
export class StaffEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ name: 'staff_id', type: 'varchar', unique: true })
  staffId: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Column({ name: 'staff_photo', type: 'text', nullable: true })
  staffPhoto: string;

  @Column({
    name: 'designation',
    type: 'enum',
    enum: DesignationEnum,
    default: DesignationEnum.CEO
  })
  designation: DesignationEnum;

  @Column({ name: 'dob', type: 'date' })
  dob: Date;

  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 20, unique: true })
  aadharNumber: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @Column({ name: 'joining_date', type: 'date' })
  joiningDate: string;

  @Column({ name: 'before_experience', type: 'int', comment: 'Experience in years' })
  beforeExperience: number;

  @Column({
    name: 'basic_salary',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  basicSalary: number;

  @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.staff)
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @OneToMany(() => AppointmentEntity, (appointmentEntity) => appointmentEntity.staffId)
  appointment: AppointmentEntity[];

  @OneToMany(() => PermissionEntity, (PermissionEntity) => PermissionEntity.staffId)
  permissions: PermissionEntity[];

  @OneToMany(() => NotificationEntity, (NotificationEntity) => NotificationEntity.user)
  notifications: NotificationEntity[];

  @OneToMany(() => AttendanceEntity, (attendanceEntity) => attendanceEntity.staffId)
  attendance: AttendanceEntity[];

  @OneToMany(() => WorkAllocationEntity, (workAllocationEntity) => workAllocationEntity.staffId)
  workAllocation: WorkAllocationEntity[];

  @OneToMany(() => ProductAssignEntity, (productAssignEntity) => productAssignEntity.staffId)
  productAssign: ProductAssignEntity[];

  @OneToMany(() => VoucherEntity, (VoucherEntity) => VoucherEntity.staffId)
  voucherId: VoucherEntity[];

  @OneToMany(() => VoucherEntity, (VoucherEntity) => VoucherEntity.paymentTo)
  voucher: VoucherEntity[];

  @OneToMany(() => RequestRaiseEntity, (voucher) => voucher.requestFrom)
  staffFrom: RequestRaiseEntity[];

  @OneToMany(() => RequestRaiseEntity, (voucher) => voucher.requestTo)
  staffTo: RequestRaiseEntity[];

  @OneToMany(() => RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.staffId)
  request: RequestRaiseEntity[];

  @OneToMany(() => TicketsEntity, (ticketsEntity) => ticketsEntity.staff)
  tickets: TicketsEntity[];

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column('varchar', { name: 'latitude', length: 20, nullable: true })
  latitude: string;

  @Column('varchar', { name: 'longitude', length: 20, nullable: true })
  longitude: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
