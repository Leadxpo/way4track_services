import { Roles } from "src/permissions/dto/role.enum";

export class CreateDesignationDto {
    id?:number
    companyCode: string;
    unitCode: string;
    designation: string;
    roles?: Permission[];
  }

  export class Permission {
      name: Roles;
      add: boolean;
      edit: boolean;
      view: boolean;
      delete: boolean;
  }