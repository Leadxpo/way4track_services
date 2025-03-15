import { UnderType } from "../entity/groups.entity";

export class GroupsDto {
    id: number;
    name: string;
    companyCode: string;
    unitCode: string;
    underType: UnderType;
    under: string;
    // underOptions: string[];

    constructor(entity?: Partial<GroupsDto>) {
        Object.assign(this, entity);
    }
}
