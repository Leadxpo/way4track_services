import { Injectable } from "@nestjs/common";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { LettersEntity } from "./entity/letters.entity";
import { LettersDto } from "./dto/letters.dto";

@Injectable()
export class LettersAdapter {
    convertLettersDtoToEntity(dto: LettersDto): LettersEntity {
        const entity = new LettersEntity();

        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;

        if (dto.staffId) {
            const staff = new StaffEntity();
            staff.staffId = dto.staffId;  // ✅ Assign the staffId to the staff entity
            entity.staffId = staff;  // ✅ Assign staff entity instead of staffId
        }

        entity.id = dto.id;
        entity.offerLetter = dto.offerLetter;
        entity.resignationLetter = dto.resignationLetter;
        entity.terminationLetter = dto.terminationLetter;
        entity.appointmentLetter = dto.appointmentLetter;
        entity.leaveFormat = dto.leaveFormat;
        entity.relievingLetter = dto.relievingLetter;
        entity.experienceLetter = dto.experienceLetter;

        return entity;
    }
}
