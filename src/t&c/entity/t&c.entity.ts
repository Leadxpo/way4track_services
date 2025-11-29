import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('termsAndCondition')
export class TermsAndConditionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'termsAndCondition', type: 'varchar', length: 500 })
  termsAndCondition: string;
  
  @Column({ name: 'image', type: 'varchar', length: 500 })
  Image: string;
  
  @Column({ name: 'companyCode', type: 'varchar', length: 500 })
  companyCode: string;

  @Column({ name: 'unitCode', type: 'varchar', length: 500 })
  unitCode: string;
}
