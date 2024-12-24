import { ClientEntity } from "src/client/entity/client.entity";
import { BaseEntity } from "typeorm";
export declare class EstimateEntity extends BaseEntity {
    id: number;
    clientId: ClientEntity;
    buildingAddress: string;
    estimateDate: string;
    estimateId: string;
    expireDate: string;
    productOrService: string;
    description: string;
    amount: number;
    products: {
        name: string;
        quantity: number;
        hsnCode: string;
        amount: number;
    }[];
    companyCode: string;
    unitCode: string;
}
