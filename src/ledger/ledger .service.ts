import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { LedgerAdapter } from './ledger.adapter';
import { LedgerRepository } from './repo/ledger.repo';
import { LedgerEntity } from './entity/ledger.entity';
import { LedgerDto } from './dto/ledger.dto';
import { GropusRepository } from 'src/groups/repo/groups.repo';
import { ErrorResponse } from 'src/models/error-response';

@Injectable()
export class LedgerService {
    constructor(
        private readonly ledgerRepository: LedgerRepository,
        private readonly adapter: LedgerAdapter,
        private readonly groupRepo: GropusRepository
    ) { }

    async updateledgerDetails(dto: LedgerDto): Promise<CommonResponse> {
        try {
            const existingledger = await this.ledgerRepository.findOne({
                where: { id: dto.id },
            });

            if (!existingledger) {
                return new CommonResponse(false, 4002, 'ledger not found for the provided ID.');
            }

            // Update the ledger details
            Object.assign(existingledger, this.adapter.toEntity(dto));
            await this.ledgerRepository.save(existingledger);

            return new CommonResponse(true, 200, 'ledger details updated successfully');
        } catch (error) {
            console.error(`Error updating ledger details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update ledger details: ${error.message}`);
        }
    }

    async handleLedgerDetails(dto: LedgerDto): Promise<CommonResponse> {

        if (dto.id) {
            // If an ID is provided, update the ledger details
            return await this.updateledgerDetails(dto);
        } else {
            // If no ID is provided, create a new ledger record
            return await this.createledgerDetails(dto);
        }
    }

    async createledgerDetails(dto: LedgerDto): Promise<CommonResponse> {
        try {
            console.error('ledger DTO:', dto);


            const newLedger = this.adapter.toEntity(dto);
            if (dto.groupId) {
                const gr = await this.groupRepo.findOne({ where: { id: dto.groupId } });
                if (!gr) {
                    throw new NotFoundException(`Group with ID ${dto.groupId} not found`);
                }
                newLedger.group = gr.under;
                newLedger.groupId = { id: gr.id } as any;  // ✅ Ensure it's an object with just the ID

            }

            // newledger.ledgerNumber = `ledgers-${(await this.groupRepo.count() + 1).toString().padStart(5, '0')}`;
            console.log('New ledger Data:', newLedger);
            await this.ledgerRepository.insert(newLedger); // 

            return new CommonResponse(true, 65152, ' Details and Permissions Created Successfully');

        } catch (error) {
            console.error(`Error creating ledger details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create ledger details: ${error.message}`);
        }
    }

    async getLedgerDetailsById(dto: LedgerDto): Promise<CommonResponse> {
        try {
            const ledger = await this.ledgerRepository.findOne({
                where: { id: dto.id }
            });

            if (!ledger) {
                throw new NotFoundException('Ledger not found');
            }

            return new CommonResponse(true, 200, 'Ledger details fetched successfully', this.adapter.toDto(ledger));
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getLedger(): Promise<CommonResponse> {
        try {
            const ledgers = await this.ledgerRepository.createQueryBuilder('ledger')
                .leftJoinAndSelect('ledger.groupId', 'group') // 👈 Ensure relations are fetched
                .getMany();

            console.log(ledgers, "????????")

            if (!ledgers.length) {
                throw new NotFoundException('No ledgers found');
            }

            // const ledgerDtos = ledgers.map((ledger) => this.adapter.toDto(ledger));

            return new CommonResponse(true, 200, 'Ledger details fetched successfully', ledgers);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateStatus(req: LedgerDto): Promise<CommonResponse> {
        try {
            const status = await this.ledgerRepository.findOne({ where: { id: req.id } });

            if (!status) {
                return new CommonResponse(false, 6541, "No Data Found");
            }

            // Prepare update payload dynamically based on request
            const updatePayload: Partial<LedgerEntity> = {};

            if (req.tdsDeductable !== undefined) {
                updatePayload.tdsDeductable = req.tdsDeductable;
            }
            if (req.tcsDeductable !== undefined) {
                updatePayload.tcsDeductable = req.tcsDeductable;
            }

            // If there's nothing to update, return an appropriate response
            if (Object.keys(updatePayload).length === 0) {
                return new CommonResponse(false, 6542, "No changes detected");
            }

            // Update only the changed fields
            await this.ledgerRepository.update(req.id, updatePayload);

            return new CommonResponse(true, 65152, "Updated Successfully");

        } catch (error) {
            console.error("Error updating status:", error);
            return new CommonResponse(false, 500, "An error occurred while updating status");
        }
    }

    async getLedgerDataTable(req: {
        group?: string;
        ledgerName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.ledgerRepository.getLedgerDataTable(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

}
