"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffEntity = exports.AccountType = exports.Qualification = exports.YesNo = exports.Gender = void 0;
const branch_entity_1 = require("../../branch/entity/branch.entity");
const work_allocation_entity_1 = require("../../work-allocation/entity/work-allocation.entity");
const product_assign_entity_1 = require("../../product-assign/entity/product-assign.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const request_raise_entity_1 = require("../../request-raise/entity/request-raise.entity");
const tickets_entity_1 = require("../../tickets/entity/tickets.entity");
const appointement_entity_1 = require("../../appointment/entity/appointement.entity");
const attendence_entity_1 = require("../../attendence/entity/attendence.entity");
const notification_entity_1 = require("../../notifications/entity/notification.entity");
const permissions_entity_1 = require("../../permissions/entity/permissions.entity");
const technician_works_entity_1 = require("../../technician-works/entity/technician-works.entity");
const typeorm_1 = require("typeorm");
const letters_entity_1 = require("../../letters/entity/letters.entity");
const dispatch_entity_1 = require("../../dispatch/entity/dispatch.entity");
const designation_entity_1 = require("../../designation/entity/designation.entity");
const staff_status_1 = require("../enum/staff-status");
const product_entity_1 = require("../../product/entity/product.entity");
var Gender;
(function (Gender) {
    Gender["MALE"] = "Male";
    Gender["FEMALE"] = "Female";
})(Gender || (exports.Gender = Gender = {}));
var YesNo;
(function (YesNo) {
    YesNo["YES"] = "Yes";
    YesNo["NO"] = "No";
})(YesNo || (exports.YesNo = YesNo = {}));
var Qualification;
(function (Qualification) {
    Qualification["TENTH"] = "10th Class";
    Qualification["INTERMEDIATE"] = "Intermediate";
    Qualification["DEGREE"] = "Degree";
    Qualification["POST_GRADUATION"] = "Post Graduation";
    Qualification["ITIORDiploma"] = "ITI / Diploma";
})(Qualification || (exports.Qualification = Qualification = {}));
var AccountType;
(function (AccountType) {
    AccountType["SAVINGS"] = "savings";
    AccountType["CURRENT"] = "current";
})(AccountType || (exports.AccountType = AccountType = {}));
let StaffEntity = class StaffEntity extends typeorm_1.BaseEntity {
};
exports.StaffEntity = StaffEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], StaffEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'office_phone_number', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "officePhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alternate_number', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "alternateNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_id', type: 'varchar', unique: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', type: 'varchar' }),
    __metadata("design:type", String)
], StaffEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "staffPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resume', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "resume", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gender', type: 'enum', enum: Gender }),
    __metadata("design:type", String)
], StaffEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dob', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'office_email', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "officeEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aadhar_number', type: 'varchar', length: 200, unique: true, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "aadharNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pan_card_number', type: 'varchar', length: 200, unique: true, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "panCardNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driving_licence', type: 'enum', enum: YesNo, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "drivingLicence", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driving_licence_number', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "drivingLicenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uan_number', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "uanNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'esic_number', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "esicNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_group', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "bloodGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'joining_date', type: 'date', nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "joiningDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'before_experience', type: 'int', comment: 'Experience in years', nullable: true }),
    __metadata("design:type", Number)
], StaffEntity.prototype, "beforeExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_number', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_branch', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "accountBranch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifsc_code', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "ifscCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "branchName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_type', type: 'enum', enum: AccountType, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'department', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'monthly_salary', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], StaffEntity.prototype, "monthlySalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'salary_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "salaryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        name: 'staff_status',
        enum: staff_status_1.StaffStatus,
        nullable: true,
        default: staff_status_1.StaffStatus.ACTIVE
    }),
    __metadata("design:type", String)
], StaffEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bike_allocation', type: 'enum', enum: YesNo, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "bikeAllocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "vehiclePhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bike_number', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "bikeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile_allocation', type: 'enum', enum: YesNo, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "mobileAllocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mail_allocation', type: 'enum', enum: YesNo, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "mailAllocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile_brand', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "mobileBrand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile_number', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imei_number', type: 'varchar', length: 250, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "imeiNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'termination_date', type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "terminationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resignation_date', type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "resignationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'final_settlement_date', type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "finalSettlementDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'insurance_number', type: 'varchar', length: 250, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "insuranceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'insurance_eligibility_date', type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "insuranceEligibilityDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'insurance_expiry_date', type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "insuranceExpiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 200, nullable: false }),
    __metadata("design:type", String)
], StaffEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unique_id', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "uniqueId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 200, nullable: false }),
    __metadata("design:type", String)
], StaffEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'latitude', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'longitude', length: 200, nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'qualifications', nullable: true }),
    __metadata("design:type", Array)
], StaffEntity.prototype, "qualifications", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.staff, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], StaffEntity.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointement_entity_1.AppointmentEntity, (appointmentEntity) => appointmentEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => technician_works_entity_1.TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permissions_entity_1.PermissionEntity, (PermissionEntity) => PermissionEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dispatch_entity_1.DispatchEntity, (DispatchEntity) => DispatchEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "dispatch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.NotificationEntity, (NotificationEntity) => NotificationEntity.user),
    __metadata("design:type", Array)
], StaffEntity.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendence_entity_1.AttendanceEntity, (attendanceEntity) => attendanceEntity.staff),
    __metadata("design:type", Array)
], StaffEntity.prototype, "attendance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_allocation_entity_1.WorkAllocationEntity, (workAllocationEntity) => workAllocationEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "workAllocation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_allocation_entity_1.WorkAllocationEntity, (workAllocationEntity) => workAllocationEntity.salesStaffRelation),
    __metadata("design:type", Array)
], StaffEntity.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_assign_entity_1.ProductAssignEntity, (productAssignEntity) => productAssignEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "productAssign", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_entity_1.VoucherEntity, (VoucherEntity) => VoucherEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_entity_1.VoucherEntity, (VoucherEntity) => VoucherEntity.paymentTo),
    __metadata("design:type", Array)
], StaffEntity.prototype, "voucher", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_raise_entity_1.RequestRaiseEntity, (voucher) => voucher.requestFrom),
    __metadata("design:type", Array)
], StaffEntity.prototype, "staffFrom", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_raise_entity_1.RequestRaiseEntity, (voucher) => voucher.requestTo),
    __metadata("design:type", Array)
], StaffEntity.prototype, "staffTo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_raise_entity_1.RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tickets_entity_1.TicketsEntity, (ticketsEntity) => ticketsEntity.staff),
    __metadata("design:type", Array)
], StaffEntity.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => letters_entity_1.LettersEntity, (LettersEntity) => LettersEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "Letters", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'designation', length: 200, nullable: false }),
    __metadata("design:type", String)
], StaffEntity.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => designation_entity_1.DesignationEntity, (designation) => designation.staff, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'designation_id', referencedColumnName: 'id' }),
    __metadata("design:type", designation_entity_1.DesignationEntity)
], StaffEntity.prototype, "designationRelation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 12, name: "carry_forward_leaves", nullable: true }),
    __metadata("design:type", Number)
], StaffEntity.prototype, "carryForwardLeaves", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'experience_details', nullable: true }),
    __metadata("design:type", Array)
], StaffEntity.prototype, "experienceDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.ProductEntity, (asserts) => asserts.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "product", void 0);
exports.StaffEntity = StaffEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'st' })
], StaffEntity);
//# sourceMappingURL=staff.entity.js.map