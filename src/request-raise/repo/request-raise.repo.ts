import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RequestRaiseEntity } from "../entity/request-raise.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";



@Injectable()

export class RequestRaiseRepository extends Repository<RequestRaiseEntity> {

    constructor(private dataSource: DataSource) {
        super(RequestRaiseEntity, dataSource.createEntityManager());
    }

    // async getTodayRequestBranchWise(req: { companyCode: string, unitCode: string, branch?: string }) {
    //     const query = this.createQueryBuilder('re')
    //         .select(`
    //                 re.request_id AS requestId,
    //                 re.request_type AS requestType,
    //                 re.description AS description,
    //                 br.name AS branch
    //             `)
    //         .leftJoin(BranchEntity, 'br', 'br.id = re.branch_id')
    //         .where(`re.company_code = "${req.companyCode}"`)
    //         .andWhere(`re.unit_code = "${req.unitCode}"`)
    //     if (req.branch) {
    //         query.andWhere('br.name LIKE :branchName', { branchName: `%${req.branch}%` });
    //     }
    //     const requestData = query.getRawMany();
    //     return requestData;
    // }

    async getTodayRequestBranchWise(req: { companyCode: string, unitCode: string, branch?: string }) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const query = this.createQueryBuilder('re')
            .select(`
                re.request_id AS requestId,
                re.request_type AS requestType,
                re.description AS description,
                br.name AS branch
            `)
            .leftJoin(BranchEntity, 'br', 'br.id = re.branch_id')
            .where('re.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('re.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('DATE(re.created_at) = :today', { today: today.toISOString().split('T')[0] });

        if (req.branch) {
            query.andWhere('br.name LIKE :branchName', { branchName: `%${req.branch}%` });
        }

        return query.getRawMany();
    }




}