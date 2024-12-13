import { Injectable } from '@nestjs/common';
import { VendorDto } from './dto/vendor.dto';
import { VendorIdDto } from './dto/vendor-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { VendorAdapter } from './vendor.adapter';
import { VendorRepository } from './repo/vendor.repo';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class VendorService {
  constructor(
    private readonly vendorAdapter: VendorAdapter,
    private readonly vendorRepository: VendorRepository,
  ) { }

  private async generateVendorId(): Promise<string> {
    const lastVendor = await this.vendorRepository
      .createQueryBuilder('vendor')
      .orderBy('vendor.id', 'DESC')
      .getOne();

    if (!lastVendor || !lastVendor.vendorId) {
      return 'V-001';
    }

    const lastIdNumber = parseInt(lastVendor.vendorId.split('-')[1], 10);
    const newIdNumber = (lastIdNumber + 1).toString().padStart(3, '0');
    return `V-${newIdNumber}`;
  }

  async saveVendorDetails(dto: VendorDto): Promise<CommonResponse> {
    try {
      const entity = this.vendorAdapter.convertDtoToEntity(dto);
      if (!dto.id) {
        entity.vendorId = await this.generateVendorId();
      }
      await this.vendorRepository.save(entity);
      const message = dto.id
        ? 'Vendor details updated successfully'
        : 'Vendor details created successfully';

      return new CommonResponse(true, 201, message, { vendorId: entity.vendorId });
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async deleteVendorDetails(dto: VendorIdDto): Promise<CommonResponse> {
    try {
      const vendor = await this.vendorRepository.findOne({ where: { id: dto.id } });
      if (!vendor) {
        return new CommonResponse(false, 404, 'Vendor not found');
      }
      await this.vendorRepository.delete(dto.id);
      return new CommonResponse(true, 200, 'Vendor details deleted successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getVendorDetails(req: VendorIdDto): Promise<CommonResponse> {
    try {
        const vendor = await this.vendorRepository.findOne({
            where: { id: req.id },
            relations: ['voucherId'],
        });

        if (!vendor) {
            return new CommonResponse(false, 404, 'Vendor not found');
        }

        const vendorResDto = this.vendorAdapter.convertEntityToDto([vendor])[0]; 

        return new CommonResponse(true, 200, 'Vendor details fetched successfully', vendorResDto);
    } catch (error) {
        throw new ErrorResponse(500, error.message);
    }
}


  async getVendorNamesDropDown(): Promise<CommonResponse> {
    const data = await this.vendorRepository.find({ select: ['name', 'id', 'vendorId'] });
    if (data.length) {
      return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
    } else {
      return new CommonResponse(false, 4579, "There Is No branch names")
    }
  }

  async uploadVendorPhoto(vendorId: number, photo: Express.Multer.File): Promise<CommonResponse> {
    try {
      const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });

      if (!vendor) {
        return new CommonResponse(false, 404, 'vendor not found');
      }

      const filePath = join(__dirname, '../../uploads/vendor_photos', `${vendorId}-${Date.now()}.jpg`);
      await fs.writeFile(filePath, photo.buffer);

      vendor.vendorPhoto = filePath;
      await this.vendorRepository.save(vendor);

      return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }
}
