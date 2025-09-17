import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAppDto } from './dto/product-app.dto';
import { ProductAppAdapter } from './product-app.adapter';
import { CommonResponse } from 'src/models/common-response';
import { ProductAppRepository } from './repo/product-app.repo';
import { ErrorResponse } from 'src/models/error-response';
import { Storage } from '@google-cloud/storage';


@Injectable()
export class ProductAppService {
  private storage: Storage;
  private bucketName: string;
  constructor(
    private readonly repo: ProductAppRepository,
    private adapter: ProductAppAdapter
  ) {
    this.storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID ||
        'sharontelematics-1530044111318',
      keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
    });

    this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
  }

  private async uploadToGCS(file: Express.Multer.File, fileName: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const gcsFile = bucket.file(fileName);

      await gcsFile.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
      });

      console.log(`Uploaded: ${fileName}`);
    } catch (error) {
      console.log(`Uploaded fsild due to \n ${error}`);

    }
  }


  async handleUpdateAppDetails(
    dto: ProductAppDto,
    pointFiles?: Express.Multer.File[],
    photo?: Express.Multer.File
  ): Promise<CommonResponse> {
    let filePath: string | null = null;

    // Upload app photo
    if (photo) {
      const bucket = this.storage.bucket(this.bucketName);
      const uniqueFileName = `app_photos/${Date.now()}-${photo.originalname}`;
      const file = bucket.file(uniqueFileName);

      await file.save(photo.buffer, {
        contentType: photo.mimetype,
        resumable: false,
      });

      console.log(`Photo uploaded: ${uniqueFileName}`);
      filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
    }

    // Build pointMap from DTO fields
    const pointMap: Record<number, any> = {};

    for (const [key, value] of Object.entries(dto)) {
      const match = key.match(/^points\[(\d+)\]\.(title|desc)$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];

        if (!pointMap[index]) pointMap[index] = {};
        pointMap[index][field] = value;
      }
    }

    // Map uploaded point files
    if (pointFiles) {
      pointFiles.forEach((file) => {
        const match = file.fieldname.match(/^points\[(\d+)\]\.file$/);

        if (match) {
          const index = parseInt(match[1], 10);
          if (!pointMap[index]) pointMap[index] = {};

          const uniqueFileName = `app_points/${Date.now()}-${file.originalname}`;
          pointMap[index]._fileUpload = {
            file,
            uniqueFileName,
          };
        }
      });
    }

    // Upload point files to GCS and build final `points` array
    const points = [];

    for (const index of Object.keys(pointMap)) {
      const item = pointMap[Number(index)];
      let fileUrl: string | null = null;

      if (item._fileUpload) {
        await this.uploadToGCS(item._fileUpload.file, item._fileUpload.uniqueFileName);
        fileUrl = `https://storage.googleapis.com/${this.bucketName}/${item._fileUpload.uniqueFileName}`;
      }

      points.push({
        title: item.title || '',
        desc: item.desc || '',
        file: fileUrl,
      });
    }

    dto.points = points;

    if (dto.id && !isNaN(Number(dto.id))) {
      dto.id = Number(dto.id);
      return this.update(dto, filePath);
    } else {
      return this.create(dto, filePath);
    }
  }

  async handleBulkProductApp(
    dtoList: ProductAppDto[],
    photos?: Express.Multer.File[],
  ): Promise<CommonResponse> {
    const results: CommonResponse[] = [];

    for (let i = 0; i < dtoList.length; i++) {
      const dto = dtoList[i];
      const photo = photos?.[i];
      const result = await this.handleSingleAmenity(dto, photo);
      results.push(result);
    }

    return new CommonResponse(true, 200, 'All amenities processed', results);
  }

  private async handleSingleAmenity(
    dto: ProductAppDto,
    photo?: Express.Multer.File,
  ): Promise<CommonResponse> {
    let filePath: string | null = null;

    if (photo) {
      const bucket = this.storage.bucket(this.bucketName);
      const uniqueFileName = `app_photos/${Date.now()}-${photo.originalname}`;
      const file = bucket.file(uniqueFileName);

      await file.save(photo.buffer, {
        contentType: photo.mimetype,
        resumable: false,
      });

      filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
    }


    return this.create(dto, filePath);

  }

  async create(dto: ProductAppDto, filePath: string | null): Promise<CommonResponse> {
    try {
      const entity = this.adapter.toEntity(dto);
      if (filePath) {
        entity.image = filePath;
      }
      await this.repo.insert(entity);
      return new CommonResponse(true, 201, 'Product App created');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async update(dto: ProductAppDto, filePath: string | null): Promise<CommonResponse> {
    try {
      const existing = await this.repo.findOne({ where: { id: dto.id } }); // 👈 include relations if needed
      if (!existing) throw new Error('App not found');

      // Handle photo replacement in GCS
      if (filePath && existing.image) {
        const existingFilePath = existing.image
          .replace(`https://storage.googleapis.com/${this.bucketName}/`, '')
          .trim();

        const file = this.storage.bucket(this.bucketName).file(existingFilePath);

        try {
          const [exists] = await file.exists();
          if (exists) {
            await file.delete();
            console.log(`Deleted old file from GCS: ${existingFilePath}`);
          } else {
            console.warn(`File not found in GCS, skipping delete: ${existingFilePath}`);
          }
        } catch (error) {
          console.error(`Error deleting old file from GCS: ${error.message}`);
        }
      }

      // Update fields from DTO
      const updatedEntity = this.adapter.toEntity(dto);
      updatedEntity.id = dto.id; // ✅ ensure ID is preserved

      existing.name = dto.name;
      existing.shortDescription = dto.shortDescription;
      existing.unitCode = dto.unitCode;
      existing.companyCode = dto.companyCode;
      existing.updatedAt = new Date();

      if (filePath) {
        existing.image = filePath;
      }

      if (dto.points) {
        existing.points = dto.points.map(point => ({
          title: point.title,
          desc: point.desc,
          file: point.file,
        }));
      }

      await this.repo.save(existing);
      return new CommonResponse(true, 200, 'Product app updated successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async findAll(): Promise<CommonResponse> {
    const branch = await this.repo.find({ relations: ['webProduct'] });

    // Convert each entity in the array to DTO
    const staffDtos = branch.map(entity => this.adapter.toDto(entity));

    if (staffDtos.length === 0) {
      return new CommonResponse(false, 35416, "There Is No List");
    }

    return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", staffDtos);
  }
}
