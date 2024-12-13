import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceEntity } from 'src/attendence/entity/attendence.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';

@Entity('staff')
export class StaffEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ name: 'staff_id', type: 'varchar' })
  staffId: string;

  @Column({ name: 'staff_photo', type: 'text' })
  staffPhoto: string;

  @Column({ name: 'designation', type: 'varchar', length: 100 })
  designation: string;

  @Column({ name: 'dob', type: 'date' })
  dob: Date;

  @Column({ name: 'email', type: 'varchar', length: 150 })
  email: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 20 })
  aadharNumber: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @Column({ name: 'joining_date', type: 'date' })
  joiningDate: Date;

  @Column({ name: 'before_experience', type: 'date' })
  beforeExperience: Date;

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

  @OneToMany(() => AppointmentEntity, (branch) => branch.staffId)
  appointment: AppointmentEntity[];

  @OneToOne(() => AttendanceEntity, (attendanceEntity) => attendanceEntity.staffId, { nullable: true })
  @JoinColumn({ name: 'attendance_id' })
  attendance: AttendanceEntity;

  @OneToMany(() => WorkAllocationEntity, (workAllocationEntity) => workAllocationEntity.staffId)
  workAllocation: WorkAllocationEntity[];

  @OneToMany(() => ProductAssignEntity, (productAssignEntity) => productAssignEntity.staffId)
  productAssign: ProductAssignEntity[];

  @OneToMany(() => RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.staffId)
  request: RequestRaiseEntity[];

  @OneToMany(() => TicketsEntity, (branch) => branch.staff)
  tickets: TicketsEntity[];
}
