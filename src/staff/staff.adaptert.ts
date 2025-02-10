import { Injectable } from '@nestjs/common';
import { StaffEntity } from './entity/staff.entity';
import { StaffDto } from './dto/staff.dto';
import { GetStaffResDto } from './dto/staff-res.dto';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceEntity } from 'src/attendence/entity/attendence.entity';

@Injectable()
export class StaffAdapter {
    convertDtoToEntity(dto: StaffDto): StaffEntity {
        const entity = new StaffEntity();
        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        entity.staffPhoto = dto.staffPhoto;
        entity.designation = dto.designation;
        entity.dob = dto.dob;
        entity.email = dto.email;
        entity.aadharNumber = dto.aadharNumber;
        entity.address = dto.address;
        entity.joiningDate = dto.joiningDate;
        entity.basicSalary = dto.basicSalary;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.password = dto.password;
        entity.beforeExperience = dto.beforeExperience;
        entity.latitude = dto.latitude
        entity.longitude = dto.longitude
        if (dto.id) {
            entity.id = dto.id;
        }

        if (dto.staffId) {
            entity.staffId = dto.staffId;
        }

        if (dto.branch) { // Ensure `branch` is set
            const branchEntity = new BranchEntity();
            branchEntity.id = dto.branch; // Make sure `dto.branch` contains the ID
            entity.branch = branchEntity;
        }

        return entity;
    }


    convertEntityToDto(entity: StaffEntity[]): GetStaffResDto[] {
        return entity.map((staffMember) => {
            return new GetStaffResDto(
                staffMember.id,
                staffMember.name,
                staffMember.phoneNumber,
                staffMember.staffId,
                staffMember.designation,
                staffMember?.branch?.id,
                staffMember?.branch?.branchName,
                staffMember.dob,
                staffMember.email,
                staffMember.aadharNumber,
                staffMember.address,
                staffMember.joiningDate,
                staffMember.basicSalary,
                staffMember.beforeExperience,
                staffMember.staffPhoto,
                staffMember.companyCode,
                staffMember.unitCode,
                staffMember.latitude,
                staffMember.longitude
            );
        });
    }

}
