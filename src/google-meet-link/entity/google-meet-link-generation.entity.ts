import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('google_meet_link')
export class GoogleMeetLinkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'meetLink', type: 'varchar', length: 500 })
  meetLink: string;
  
  @Column({ name: 'companyCode', type: 'varchar', length: 500 })
  companyCode: string;

  @Column({ name: 'unitCode', type: 'varchar', length: 500 })
  unitCode: string;
}
