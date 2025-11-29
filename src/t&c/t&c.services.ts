import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermsAndConditionEntity } from './entity/t&c.entity';
import TermsAndConditionDto from './dto/t&c.dto';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class TermsAndConditionService {
  private storage: Storage;
  private bucketName: string;

  constructor(
    @InjectRepository(TermsAndConditionEntity)
    private readonly repo: Repository<TermsAndConditionEntity>,
  ) {
    this.storage = new Storage({
      projectId:
        process.env.GCLOUD_PROJECT_ID || 'sharontelematics-1530044111318',
      keyFilename:
        process.env.GCLOUD_KEY_FILE ||
        'sharontelematics-1530044111318-0b877bc770fc.json',
    });

    this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
  }

  // -------------------------------
  // Upload file to GCP
  // -------------------------------
  private async uploadToGCS(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const fileName = `terms_condition/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      public: true,
      validation: 'md5',
    });

    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

  // -------------------------------
  // CREATE (with photo)
  // -------------------------------
  async create(dto: TermsAndConditionDto, photo?: Express.Multer.File) {
    let photoUrl: string | null = null;

    if (photo) {
      photoUrl = await this.uploadToGCS(photo);
    }

    const data = this.repo.create({
      ...dto,
      image: photoUrl, // ensure your entity contains "photo" column
    });

    return this.repo.save(data);
  }

  // -------------------------------
  // GET ALL
  // -------------------------------
  async findAll() {
    return this.repo.find();
  }

  // -------------------------------
  // GET ONE
  // -------------------------------
  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  // -------------------------------
  // UPDATE (with optional photo)
  // -------------------------------
  async update(
    id: number,
    dto: TermsAndConditionDto,
    photo?: Express.Multer.File,
  ) {
    const record = await this.findOne(id);

    let photoUrl = record.image; // keep old image

    if (photo) {
      photoUrl = await this.uploadToGCS(photo);
    }

    const updated = Object.assign(record, {
      ...dto,
      photo: photoUrl,
    });

    return this.repo.save(updated);
  }

  // -------------------------------
  // DELETE
  // -------------------------------
  async remove(id: number) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}
