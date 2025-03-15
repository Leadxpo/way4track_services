import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupsEntity } from "./entity/groups.entity";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";
import { GropusRepository } from "./repo/groups.repo";
import { GroupsAdapter } from "./groups.adapter";


@Module({
    imports: [TypeOrmModule.forFeature([GroupsEntity])],
    controllers: [GroupsController],
    providers: [GroupsService, GropusRepository, GroupsAdapter],
    exports: [GroupsService, GropusRepository],
})
export class GroupsModule { }
