import { VoucherDto } from "./dto/voucher.dto";
import { VoucherEntity } from "./entity/voucher.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { VoucherResDto } from "./dto/voucher-res.dto";
export declare class VoucherAdapter {
    entityToDto(entity: VoucherEntity): VoucherResDto;
    dtoToEntity(dto: VoucherDto, branch: BranchEntity, client?: ClientEntity, subDealer?: SubDealerEntity, vendor?: VendorEntity): VoucherEntity;
}
