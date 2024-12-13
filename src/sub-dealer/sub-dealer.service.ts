import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { SubDealerAdapter } from './sub-dealer.adapter';
import { SubDealerRepository } from './repo/sub-dealer.repo';
import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class SubDealerService {
  constructor(
    private readonly subDealerAdapter: SubDealerAdapter,
    private readonly subDealerRepository: SubDealerRepository,
  ) { }

  private async generateSubDealerId(): Promise<string> {
    const lastSubDealer = await this.subDealerRepository
      .createQueryBuilder('subDealer')
      .orderBy('subDealer.id', 'DESC')
      .getOne();

    if (!lastSubDealer || !lastSubDealer.subDealerId) {
      return 'SD-001';
    }

    const lastIdNumber = parseInt(lastSubDealer.subDealerId.split('-')[1], 10);
    const newIdNumber = (lastIdNumber + 1).toString().padStart(3, '0');
    return `SD-${newIdNumber}`;
  }

  async saveSubDealerDetails(dto: SubDealerDto): Promise<CommonResponse> {
    try {
      const entity = this.subDealerAdapter.convertDtoToEntity(dto);
      if (!dto.id) {
        entity.subDealerId = await this.generateSubDealerId();
      }
      await this.subDealerRepository.save(entity);
      const message = dto.id
        ? 'SubDealer details updated successfully'
        : 'SubDealer details created successfully';

      return new CommonResponse(true, 201, message, { subDealerId: entity.subDealerId });
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async deleteSubDealerDetails(dto: SubDealerIdDto): Promise<CommonResponse> {
    try {
      const subDealer = await this.subDealerRepository.findOne({ where: { id: dto.id } });
      if (!subDealer) {
        return new CommonResponse(false, 404, 'SubDealer not found');
      }
      await this.subDealerRepository.delete(dto.id);
      return new CommonResponse(true, 200, 'SubDealer details deleted successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getSubDealerDetails(req: SubDealerIdDto): Promise<CommonResponse> {
    try {
      const subDealer = await this.subDealerRepository.findOne({ where: { id: req.id }, relations: ['voucherId'] });
      if (!subDealer) {
        return new CommonResponse(false, 404, 'SubDealer not found');
      }
      const resDto = this.subDealerAdapter.convertEntityToDto([subDealer])[0];

      return new CommonResponse(true, 200, 'SubDealer details fetched successfully', resDto);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getSubDealerNamesDropDown(): Promise<CommonResponse> {
    const data = await this.subDealerRepository.find({ select: ['name', 'id', 'subDealerId'] });
    if (data.length) {
      return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
    } else {
      return new CommonResponse(false, 4579, "There Is No branch names")
    }
  }

  async uploadSubDealerPhoto(subDealerId: number, photo: Express.Multer.File): Promise<CommonResponse> {
    try {
      const subDealer = await this.subDealerRepository.findOne({ where: { id: subDealerId } });

      if (!subDealer) {
        return new CommonResponse(false, 404, 'subDealer not found');
      }

      const filePath = join(__dirname, '../../uploads/subDealer_photos', `${subDealerId}-${Date.now()}.jpg`);
      await fs.writeFile(filePath, photo.buffer);

      subDealer.subDealerPhoto = filePath;
      await this.subDealerRepository.save(subDealer);

      return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }
}
