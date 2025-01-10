import { Injectable } from '@nestjs/common';
import { AssertsDto } from './dto/asserts.dto';
import { AssertsIdDto } from './dto/asserts-id.dto';
import { AssertsRepository } from './repo/asserts.repo';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { join } from 'path';
import { promises as fs } from 'fs';
import { AssertsEntity } from './entity/asserts-entity';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { AssertsVoucherIdDto } from './dto/asserts-voucher-id.dto';
import { AssertsAdapter } from './asserts.adapter';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { CommonReq } from 'src/models/common-req';
@Injectable()
export class AssertsService {
    constructor(
        private adapter: AssertsAdapter,
        private assertsRepository: AssertsRepository,
        private voucherRepo: VoucherRepository,
        private readonly branchRepo: BranchRepository

    ) { }

    async getAssertDetails(req: AssertsIdDto): Promise<CommonResponse> {
        try {
            const assert = await this.assertsRepository.findOne({
                relations: ['branchId', 'voucherId'],
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
            });

            if (!assert) {
                return new CommonResponse(false, 404, 'Assert not found');
            }
            const data = this.adapter.convertEntityToDto(assert);
            return new CommonResponse(true, 6541, 'Data Retrieved Successfully', data);
        } catch (error) {
            console.error('Error in getAssertDetails service:', error);
            return new CommonResponse(false, 500, 'Error fetching assert details');
        }
    }

    async getAllAssertDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const assert = await this.assertsRepository.find({
                relations: ['branchId', 'voucherId'],
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
            });

            if (!assert) {
                return new CommonResponse(false, 404, 'Assert not found');
            }
            return new CommonResponse(true, 6541, 'Data Retrieved Successfully', assert);
        } catch (error) {
            console.error('Error in getAssertDetails service:', error);
            return new CommonResponse(false, 500, 'Error fetching assert details');
        }
    }


    async create(createAssertsDto: AssertsDto, photo: Express.Multer.File): Promise<CommonResponse> {
        try {
            const voucher = await this.voucherRepo.findOne({ where: { voucherId: createAssertsDto.voucherId } });

            if (!voucher) {
                throw new Error('Voucher not found');
            }

            let filePath: string | null = null;
            if (photo) {
                filePath = join(__dirname, '../../uploads/assert_photos', `${Date.now()}-${photo.originalname}`);
                await fs.writeFile(filePath, photo.buffer);
            }

            const entity = await this.adapter.convertDtoToEntity(createAssertsDto);

            if (filePath) {
                entity.assetPhoto = filePath;
            }

            await this.assertsRepository.save(entity);

            const message = createAssertsDto.id
                ? 'Assert Details Updated Successfully'
                : 'Assert Details Created Successfully';

            return new CommonResponse(true, 200, message, { photoPath: filePath });

        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async deleteAssertDetails(dto: AssertsIdDto): Promise<CommonResponse> {
        try {
            const assertExists = await this.assertsRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!assertExists) {
                throw new ErrorResponse(404, `assert with ID ${dto.id} does not exist`);
            }
            await this.assertsRepository.delete(dto.id);
            return new CommonResponse(true, 65153, 'assert Details Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5417, error.message);
        }
    }

}
