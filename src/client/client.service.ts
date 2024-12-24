import { Injectable } from '@nestjs/common';
import { ClientRepository } from './repo/client.repo';
import { ClientDto } from './dto/client.dto';
import { ClientIdDto } from './dto/client-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { ClientAdapter } from './client.adapter';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { join } from 'path';
import { writeFile } from 'fs';
import { promises as fs } from 'fs';

@Injectable()
export class ClientService {
    constructor(
        private readonly clientAdapter: ClientAdapter,
        private readonly clientRepository: ClientRepository,
        private readonly branchRepo: BranchRepository
    ) { }

    async saveClientDetails(dto: ClientDto, file?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let photoPath: string | undefined;

            if (file) {
                photoPath = await this.uploadClientPhoto(file);
            }

            const branchEntity = await this.branchRepo.findOne({ where: { id: dto.branchId } });
            if (!branchEntity) {
                throw new Error('Branch not found');
            }

            const entity = this.clientAdapter.convertDtoToEntity(dto);

            if (!dto.id && !entity.clientId) {
                const clientCount = await this.clientRepository.count({
                    where: { companyCode: dto.companyCode, unitCode: dto.unitCode },
                });
                entity.clientId = this.generateClientId(branchEntity.branchName, clientCount + 1);
            }

            if (photoPath) {
                entity.clientPhoto = photoPath;
            }

            if (dto.id) {
                const existingClient = await this.clientRepository.findOne({ where: { id: dto.id } });
                if (!existingClient) {
                    throw new Error('Client not found');
                }

                const updatedClient = {
                    ...existingClient,
                    ...entity,
                    clientPhoto: photoPath || existingClient.clientPhoto,
                };

                await this.clientRepository.save(updatedClient);
            } else {
                const branch = new BranchEntity()
                branch.id = dto.branchId
                entity.branch = branch
                await this.clientRepository.save(entity);
            }

            const internalMessage = dto.id
                ? 'Client details updated successfully'
                : 'Client details created successfully';

            return new CommonResponse(true, 201, internalMessage);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async uploadClientPhoto(photo: Express.Multer.File): Promise<string> {
        try {
            const filePath = join(__dirname, '../../uploads/client_photos', `${Date.now()}.jpg`);
            await fs.writeFile(filePath, photo.buffer);
            return filePath;
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async deleteClientDetails(dto: ClientIdDto): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!client) {
                return new CommonResponse(false, 404, 'Client not found');
            }
            await this.clientRepository.delete(dto.id);
            return new CommonResponse(true, 200, 'Client details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getClientDetails(req: ClientIdDto): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.find({ relations: ['branch', 'voucherId'], where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!client) {
                return new CommonResponse(false, 404, 'Client not found');
            }
            else {
                const data = this.clientAdapter.convertEntityToDto(client)
                return new CommonResponse(true, 200, 'Client details fetched successfully', data);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    /**
     * Generates a clientId in the format CLI(${branchName})-${paddedNumber}.
     */
    private generateClientId(branchName: string, sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        return `CLI(${branchName})-${paddedNumber}`;
    }

    async getClientNamesDropDown(): Promise<CommonResponse> {
        const data = await this.clientRepository.find({ select: ['name', 'id', 'clientId'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

}
