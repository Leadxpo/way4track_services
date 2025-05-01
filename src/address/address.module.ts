import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressAdapter } from "./address.adapter";
import { AddressRepository } from "./repo/address-repo";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";
import { AddressEntity } from "./entity/address.entity";


@Module({
    imports: [TypeOrmModule.forFeature([AddressEntity])],
    providers: [AddressService, AddressAdapter, AddressRepository],
    controllers: [AddressController],
    exports: [AddressRepository, AddressService]
})
export class AddressModule { }
