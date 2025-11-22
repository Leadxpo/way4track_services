import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleMeetLinkEntity } from './entity/google-meet-link-generation.entity';
import GoogleMeetLinkDto from './dto/google-meet-link.dto';

@Injectable()
export class GoogleMeetLinkService {
  constructor(
    @InjectRepository(GoogleMeetLinkEntity)
    private readonly repo: Repository<GoogleMeetLinkEntity>,
  ) {}

  // ✔ Create
  async create(dto: GoogleMeetLinkDto) {
    const data = this.repo.create(dto);
    return this.repo.save(data);
  }

  // ✔ Get all
  async findAll() {
    return this.repo.find();
  }

  // ✔ Get one
  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  // ✔ Update
  async update(id: number, dto: GoogleMeetLinkDto) {
    const record = await this.findOne(id);
    const updated = Object.assign(record, dto);
    return this.repo.save(updated);
  }

  // ✔ Delete
  async remove(id: number) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}
