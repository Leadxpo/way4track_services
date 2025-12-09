import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('termsAndCondition')
export class TermsAndConditionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'termsAndCondition', type: 'text', })
  termsAndCondition: string;
  
  @Column({ name: 'image', type: 'varchar', length: 500,nullable:true})
  image: string;
  
  @Column({ name: 'companyCode', type: 'varchar', length: 500 })
  companyCode: string;

  @Column({ name: 'unitCode', type: 'varchar', length: 500 })
  unitCode: string;
}
