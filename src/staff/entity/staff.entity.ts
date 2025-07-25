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
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity } from 'typeorm';
import { LettersEntity } from '../../letters/entity/letters.entity';
import { DispatchEntity } from 'src/dispatch/entity/dispatch.entity';
import { OtpEntity } from 'src/otp-generation/entity/otp-generation.entity';
import { DesignationEntity } from 'src/designation/entity/designation.entity';
import { StaffStatus } from '../enum/staff-status';
import { Letters } from '../enum/qualifications.enum';
import { Experience } from '../dto/staff.dto';
import { ProductEntity } from 'src/product/entity/product.entity';
import { SalesWorksEntity } from 'src/sales-man/entity/sales-man.entity';


export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum YesNo {
  YES = 'Yes',
  NO = 'No',
}

export enum Qualification {
  TENTH = '10th Class',
  INTERMEDIATE = 'Intermediate',
  DEGREE = 'Degree',
  POST_GRADUATION = 'Post Graduation',
  ITIORDiploma = "ITI / Diploma"
}

export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
}
@Entity({ name: 'st' })
export class StaffEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 15, nullable: true })
  phoneNumber: string;

  @Column({ name: 'office_phone_number', type: 'varchar', length: 15, nullable: true })
  officePhoneNumber: string;

  @Column({ name: 'alternate_number', type: 'varchar', length: 15, nullable: true })
  alternateNumber: string;

  @Column({ name: 'staff_id', type: 'varchar', unique: true })
  staffId: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Column({ name: 'staff_photo', type: 'text', nullable: true })
  staffPhoto: string;

  @Column({ name: 'resume', type: 'text', nullable: true })
  resume: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ name: 'dob', type: 'date', nullable: true })
  dob: Date;

  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'office_email', type: 'varchar', length: 150, nullable: true })
  officeEmail: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 200, unique: true, nullable: true })
  aadharNumber: string;

  @Column({ name: 'pan_card_number', type: 'varchar', length: 200, unique: false, nullable: true })
  panCardNumber: string;

  @Column({ name: 'driving_licence', type: 'enum', enum: YesNo, nullable: true })
  drivingLicence: YesNo;

  @Column({ name: 'driving_licence_number', type: 'varchar', length: 200, nullable: true })
  drivingLicenceNumber: string;

  @Column({ name: 'uan_number', type: 'varchar', length: 200, nullable: true })
  uanNumber: string;

  @Column({ name: 'esic_number', type: 'varchar', length: 200, nullable: true })
  esicNumber: string;

  @Column({ name: 'blood_group', type: 'varchar', length: 50, nullable: true })
  bloodGroup: string;

  @Column({ name: 'joining_date', type: 'date', nullable: true })
  joiningDate: string;

  @Column({ name: 'before_experience', type: 'int', comment: 'Experience in years', nullable: true })
  beforeExperience: number;

  @Column({ name: 'bank_name', type: 'varchar', length: 255, nullable: true })
  bankName: string;

  @Column({ name: 'account_number', type: 'varchar', length: 200, nullable: true })
  accountNumber: string;

  @Column({ name: 'account_branch', type: 'varchar', length: 200, nullable: true })
  accountBranch: string;

  @Column({ name: 'ifsc_code', type: 'varchar', length: 200, nullable: true })
  ifscCode: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @Column({ name: 'branch_name', type: 'varchar', length: 255, nullable: true })
  branchName: string;

  @Column({ name: 'account_type', type: 'enum', enum: AccountType, nullable: true })
  accountType: AccountType;

  @Column({ name: 'department', type: 'varchar', length: 255, nullable: true })
  department: string;

  @Column({ name: 'monthly_salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlySalary: number;

  // @Column({ name: 'professional_tax', type: 'decimal', precision: 10, scale: 2, nullable: true })
  // professionalTax: number;

  @Column({ name: 'salary_date', type: 'date', nullable: true })
  salaryDate: Date;

  @Column({
    type: 'enum',
    name: 'staff_status',
    enum: StaffStatus,
    nullable: true,
    default: StaffStatus.ACTIVE
  })
  status: StaffStatus;

  @Column({ name: 'bike_allocation', type: 'enum', enum: YesNo, nullable: true })
  bikeAllocation: YesNo;

  @Column({ name: 'vehicle_photo', type: 'text', nullable: true })
  vehiclePhoto: string;

  @Column({ name: 'bike_number', type: 'varchar', length: 200, nullable: true })
  bikeNumber: string;

  @Column({ name: 'mobile_allocation', type: 'enum', enum: YesNo, nullable: true })
  mobileAllocation: YesNo;

  @Column({ name: 'mail_allocation', type: 'enum', enum: YesNo, nullable: true })
  mailAllocation: YesNo;

  @Column({ name: 'mobile_brand', type: 'varchar', length: 100, nullable: true })
  mobileBrand: string;

  @Column({ name: 'mobile_number', type: 'varchar', length: 15, nullable: true })
  mobileNumber: string;

  @Column({ name: 'imei_number', type: 'varchar', length: 250, nullable: true })
  imeiNumber: string;

  @Column({ name: 'termination_date', type: 'date', nullable: true, default: null })
  terminationDate: Date;

  @Column({ name: 'resignation_date', type: 'date', nullable: true, default: null })
  resignationDate: Date;

  @Column({ name: 'final_settlement_date', type: 'date', nullable: true, default: null })
  finalSettlementDate: Date;

  @Column({ name: 'insurance_number', type: 'varchar', length: 250, nullable: true })
  insuranceNumber: string;

  @Column({ name: 'insurance_eligibility_date', type: 'date', nullable: true, default: null })
  insuranceEligibilityDate: Date;

  @Column({ name: 'insurance_expiry_date', type: 'date', nullable: true, default: null })
  insuranceExpiryDate: Date;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column('varchar', { name: 'company_code', length: 200, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unique_id', length: 200, nullable: true })
  uniqueId: string;

  @Column('varchar', { name: 'unit_code', length: 200, nullable: false })
  unitCode: string;

  @Column('varchar', { name: 'latitude', length: 200, nullable: true })
  latitude: string;

  @Column('varchar', { name: 'longitude', length: 200, nullable: true })
  longitude: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'json', name: 'qualifications', nullable: true })
  qualifications: {
    qualificationName: string;
    marksOrCgpa: number;
    file?: string;
  }[];

  @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.staff, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @OneToMany(() => AppointmentEntity, (appointmentEntity) => appointmentEntity.staffId)
  appointment: AppointmentEntity[];

  // @OneToMany(() => OtpEntity, (OtpEntity) => OtpEntity.staff)
  // otpGeneration: OtpEntity[];

  @OneToMany(() => TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.staffId)
  technician: TechnicianWorksEntity[];

  @OneToMany(() => SalesWorksEntity, (SalesWorksEntity) => SalesWorksEntity.staffId)
  salesWork: SalesWorksEntity[];

  @OneToMany(() => PermissionEntity, (PermissionEntity) => PermissionEntity.staffId)
  permissions: PermissionEntity[];

  @OneToMany(() => DispatchEntity, (DispatchEntity) => DispatchEntity.staffId)
  dispatch: DispatchEntity[];

  @OneToMany(() => NotificationEntity, (NotificationEntity) => NotificationEntity.user)
  notifications: NotificationEntity[];

  @OneToMany(() => AttendanceEntity, (attendanceEntity) => attendanceEntity.staff)
  attendance: AttendanceEntity[];

  @OneToMany(() => WorkAllocationEntity, (workAllocationEntity) => workAllocationEntity.staffId)
  workAllocation: WorkAllocationEntity[];

  @OneToMany(() => WorkAllocationEntity, (workAllocationEntity) => workAllocationEntity.salesStaffRelation)
  sales: WorkAllocationEntity[];

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

  @OneToMany(() => LettersEntity, (LettersEntity) => LettersEntity.staffId)
  Letters: LettersEntity[];

  @Column('varchar', { name: 'designation', length: 200, nullable: false })
  designation: string;

  @ManyToOne(() => DesignationEntity, (designation) => designation.staff, { nullable: true })
  @JoinColumn({ name: 'designation_id', referencedColumnName: 'id' }) // Use the primary key of DesignationEntity
  designationRelation: DesignationEntity;

  @Column({ type: 'int', default: 12, name: "carry_forward_leaves", nullable: true })
  carryForwardLeaves: number;

  @Column({ type: 'json', name: 'experience_details', nullable: true })
  experienceDetails: Experience[];

  @OneToMany(() => ProductEntity, (asserts) => asserts.staffId)
  product: ProductEntity[];
  

}
