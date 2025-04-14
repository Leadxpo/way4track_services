import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StaffEntity } from 'src/staff/entity/staff.entity';

@Entity('otp')
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'staff_id', type: 'varchar', nullable: true })
  staffId: string;  // Store staffId directly

  // @ManyToOne(() => StaffEntity, (staff) => staff.otpGeneration, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'staff_id' })
  // staff: StaffEntity;

  @Column({ name: 'otp', type: 'varchar', length: 6 })
  otp: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;
}
