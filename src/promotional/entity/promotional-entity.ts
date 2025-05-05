import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
@Entity('promotion')
export class PromotionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ name: 'header', type: 'varchar', length: 100, nullable: true })
    header: string;

    @Column({ name: 'short_description', type: 'varchar', length: 100, nullable: true })
    shortDescription: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'theme', type: 'text', nullable: true })
    theme: string;

    @Column({ name: 'image', type: 'varchar', length: 255, nullable: true })
    image: string;

    @Column({ name: 'theme_bgimage', type: 'varchar', length: 255, nullable: true })
    themeBgimage: string;

    @Column('json', { name: 'list', nullable: true })
    list: {
        name: string
        photo?: string;
        desc: string;
    }[];
}
