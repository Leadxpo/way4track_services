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

  private generateVendorId(sequenceNumber: number): string {
    const paddedNumber = sequenceNumber.toString().padStart(3, '0');
    return `v-${paddedNumber}`;
  }
  async updateVendorDetails(dto: VendorDto, filePath: string | null): Promise<CommonResponse> {
    try {
      const existingVendor = await this.vendorRepository.findOne({
        where: { id: dto.id, vendorId: dto.vendorId, companyCode: dto.companyCode, unitCode: dto.unitCode },
      });

      if (!existingVendor) {
        return new CommonResponse(false, 4002, 'Vendor not found for the provided ID.');
      }

      Object.assign(existingVendor, this.vendorAdapter.convertDtoToEntity(dto));
      if (filePath) {
        existingVendor.vendorPhoto = filePath;
      }
      await this.vendorRepository.save(existingVendor);

      return new CommonResponse(true, 200, 'Vendor details updated successfully');
    } catch (error) {
      throw new ErrorResponse(500, `Failed to update vendor details: ${error.message}`);
    }
  }

  async createVendorDetails(dto: VendorDto, filePath: string | null): Promise<CommonResponse> {
    try {
      const entity = this.vendorAdapter.convertDtoToEntity(dto);

      if (!entity.vendorId) {
        const allocationCount = await this.vendorRepository.count({});
        entity.vendorId = this.generateVendorId(allocationCount + 1);
      }
      if (filePath) {
        entity.vendorPhoto = filePath;
      }
      console.log(filePath, "+++")
      await this.vendorRepository.insert(entity);
      return new CommonResponse(true, 201, 'Vendor details created successfully');
    } catch (error) {
      throw new ErrorResponse(500, `Failed to create vendor details: ${error.message}`);
    }
  }

  async handleVendorDetails(dto: VendorDto, photo?: Express.Multer.File): Promise<CommonResponse> {
    try {
      let filePath: string | null = null;
      if (photo) {
        filePath = join(__dirname, '../../uploads/vendor_photos', `${Date.now()}-${photo.originalname}`);
        await fs.writeFile(filePath, photo.fieldname)
      }
      console.log(filePath, "+++")
      if (dto.id || dto.vendorId) {
        // If an ID or vendorId is provided, update the vendor details
        return await this.updateVendorDetails(dto, filePath);
      } else {
        // If no ID is provided, create a new vendor record
        return await this.createVendorDetails(dto, filePath);
      }
    } catch (error) {
      console.error(`Error handling vendor details: ${error.message}`, error.stack);
      throw new ErrorResponse(5416, `Failed to handle vendor details: ${error.message}`);
    }

  }

  async deleteVendorDetails(dto: VendorIdDto): Promise<CommonResponse> {
    try {
      const vendor = await this.vendorRepository.findOne({ where: { vendorId: dto.vendorId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
      if (!vendor) {
        return new CommonResponse(false, 404, 'Vendor not found');
      }
      await this.vendorRepository.delete(dto.vendorId);
      return new CommonResponse(true, 200, 'Vendor details deleted successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getVendorDetails(req: VendorIdDto): Promise<CommonResponse> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { vendorId: req.vendorId, companyCode: req.companyCode, unitCode: req.unitCode },
        relations: ['voucherId', 'branch'],
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

  // async uploadVendorPhoto(vendorId: number, photo: Express.Multer.File): Promise<CommonResponse> {
  //   try {
  //     const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });

  //     if (!vendor) {
  //       return new CommonResponse(false, 404, 'vendor not found');
  //     }

  //     const filePath = join(__dirname, '../../uploads/vendor_photos', `${vendorId}-${Date.now()}.jpg`);
  //     await fs.writeFile(filePath, photo.buffer);

  //     vendor.vendorPhoto = filePath;
  //     await this.vendorRepository.save(vendor);

  //     return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
  //   } catch (error) {
  //     throw new ErrorResponse(500, error.message);
  //   }
  // }
}
