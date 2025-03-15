import { GroupsDto } from "./dto/groups.dto";
import { GroupsEntity, UnderType, UnderPrimary, UnderSecondary } from "./entity/groups.entity";

export class GroupsAdapter {
    toEntity(dto: GroupsDto): GroupsEntity {
        const entity = new GroupsEntity();
        entity.id = dto.id;
        entity.name = dto.name;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        // entity.tdsDeductable = dto.tdsDeductable;
        entity.underType = dto.underType;
        entity.under = dto.under; // Ensure it's mapped correctly
        return entity;
    }

    toDto(entity: GroupsEntity): GroupsDto {
        return new GroupsDto({
            id: entity.id,
            name: entity.name,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            // tdsDeductable: entity.tdsDeductable,
            underType: entity.underType,
            under: entity.under,
            // underOptions: this.getUnderOptions(entity.underType),
        });
    }

    // private getUnderOptions(underType: UnderType): string[] {
    //     return underType === UnderType.PRIMARY ? Object.values(UnderPrimary) : Object.values(UnderSecondary);
    // }
}
