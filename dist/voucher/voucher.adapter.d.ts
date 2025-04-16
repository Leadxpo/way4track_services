import { VoucherDto } from "./dto/voucher.dto";
import { VoucherEntity } from "./entity/voucher.entity";
import { VoucherResDto } from "./dto/voucher-res.dto";
export declare class VoucherAdapter {
    dtoToEntity(dto: VoucherDto): VoucherEntity;
    entityToDto(entity: VoucherEntity | VoucherEntity[]): VoucherResDto[];
}
