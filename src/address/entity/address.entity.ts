
import { ClientEntity } from 'src/client/entity/client.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';



@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 15, nullable: true })
  phoneNumber: string;

  @Column({ name: 'country', type: 'varchar', nullable: true })
  country: string;

  @Column({ name: 'state', type: 'varchar', nullable: true })
  state: string;

  @Column({ name: 'city', type: 'varchar', nullable: true })
  city: string;

  @Column({ name: 'pincode', type: 'varchar', nullable: true })
  pincode: string;

  @Column({ name: 'address_line_one', type: 'varchar', nullable: true })
  addressLineOne: string;

  @Column({ name: 'address_line_two', type: 'varchar', nullable: true })
  addressLineTwo: string;

  @ManyToOne(() =>ClientEntity, (client) => client.id, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
