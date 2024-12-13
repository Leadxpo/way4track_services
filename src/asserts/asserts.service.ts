import { Injectable } from '@nestjs/common';
import { AssertsAdapter } from './asserts.adapter';
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
@Injectable()
export class AssertsService {
    constructor(
        private adapter: AssertsAdapter,
        private assertsRepository: AssertsRepository,
        private voucherRepo: VoucherRepository
    ) { }

    async getAssertDetails(req: AssertsIdDto): Promise<CommonResponse> {
        try {

            const voucherEntity = new VoucherEntity()
            voucherEntity.id = req.id
            const assert = await this.assertsRepository.findOne({
                relations: ['branchId', 'voucherId'],
                where: { voucherId: voucherEntity },
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

    async create(createAssertsDto: AssertsDto): Promise<CommonResponse> {
        try {
            const voucher = await this.voucherRepo.findOne({
                where: { voucherId: createAssertsDto.voucherId },
                relations: ['branchId'],
            });

            if (!voucher) {
                throw new Error('Voucher not found');
            }

            const message = createAssertsDto.id
                ? 'Assert Details Updated Successfully'
                : 'Assert Details Created Successfully';

            const assertsEntity = new AssertsEntity();

            assertsEntity.voucherId = voucher;
            assertsEntity.branchId = voucher.branchId;
            assertsEntity.purchaseDate = voucher.generationDate;

            assertsEntity.assertsName = voucher.name;
            assertsEntity.assertsAmount = voucher.amount;
            assertsEntity.quantity = voucher.quantity;
            assertsEntity.description = createAssertsDto.description;
            assertsEntity.initialPayment = voucher.initialPayment;
            assertsEntity.numberOfEmi = voucher.numberOfEmi;
            assertsEntity.emiAmount = voucher.emiAmount;
            assertsEntity.assetType = createAssertsDto.assetType;
            assertsEntity.assetPhoto = createAssertsDto.assetPhoto;

            await this.assertsRepository.save(assertsEntity);

            return new CommonResponse(true, 65152, message);
        } catch (error) {
            throw new ErrorResponse(5416, error.message);
        }
    }

    async deleteAssertDetails(dto: AssertsIdDto): Promise<CommonResponse> {
        try {
            const assertExists = await this.assertsRepository.findOne({ where: { id: dto.id } });
            if (!assertExists) {
                throw new ErrorResponse(404, `assert with ID ${dto.id} does not exist`);
            }
            await this.assertsRepository.delete(dto.id);
            return new CommonResponse(true, 65153, 'assert Details Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5417, error.message);
        }
    }

    async uploadAssertPhoto(assertId: number, photo: Express.Multer.File): Promise<CommonResponse> {
        try {
            const assert = await this.assertsRepository.findOne({ where: { id: assertId } });

            if (!assert) {
                return new CommonResponse(false, 404, 'assert not found');
            }

            const filePath = join(__dirname, '../../uploads/assert_photos', `${assertId}-${Date.now()}.jpg`);
            await fs.writeFile(filePath, photo.buffer);

            assert.assetPhoto = filePath;
            await this.assertsRepository.save(assert);

            return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
