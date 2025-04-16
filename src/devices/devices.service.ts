import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { DeviceRepository } from './repo/devices.repo';
import { DeviceDto } from './dto/devices.dto';
import { DeviceAdapter } from './devices.adapter';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository,
    private readonly adapter:DeviceAdapter
  ) {}

  async handleDeviceDetails(dto: DeviceDto): Promise<CommonResponse> {
    try {
      if (dto.id) {
        return this.updateDeviceDetails(dto);
      } else {
        return this.createDeviceDetails(dto);
      }
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async createDeviceDetails(dto: DeviceDto): Promise<CommonResponse> {
    try {
      const entity = DeviceAdapter.convertDtoToEntity(dto);
      await this.deviceRepository.insert(entity);
      return new CommonResponse(true, 201, 'Device created successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async updateDeviceDetails(dto: DeviceDto): Promise<CommonResponse> {
    try {
      const existing = await this.deviceRepository.findOne({ where: { id: dto.id } });

      if (!existing) throw new Error('Device not found');

      await this.deviceRepository.update(dto.id, dto);
      return new CommonResponse(true, 200, 'Device updated successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async deleteDeviceDetails(dto: HiringIdDto): Promise<CommonResponse> {
    try {
      const existing = await this.deviceRepository.findOne({ where: { id: dto.id } });

      if (!existing) return new CommonResponse(false, 404, 'Device not found');

      await this.deviceRepository.delete({ id: existing.id });
      return new CommonResponse(true, 200, 'Device deleted successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getDeviceDetailsById(req: HiringIdDto): Promise<CommonResponse> {
    try {
      const item = await this.deviceRepository.findOne({
        where: { id: req.id },
        relations: ['webProduct'],
      });

      if (!item) return new CommonResponse(false, 404, 'Device not found');
      return new CommonResponse(true, 200, 'Device fetched successfully', item);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getDeviceDetails(req: CommonReq): Promise<CommonResponse> {
    try {
      const items = await this.deviceRepository.find({
        relations: ['webProduct'],
      });

      if (!items || !items.length) return new CommonResponse(false, 404, 'Device not found');

      const data = DeviceAdapter.convertEntityToDto(items);
      return new CommonResponse(true, 200, 'Device list fetched', data);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getDeviceDropdown(): Promise<CommonResponse> {
    try {
      const data = await this.deviceRepository.find({
        select: ['id', 'webProductName'],
      });

      if (data.length) {
        return new CommonResponse(true, 200, 'Dropdown fetched', data);
      }

      return new CommonResponse(false, 404, 'No Device entries');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }
}