import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoLeadEntity } from './entity/demoLead.entity';
import { DemoLeadAdapter } from './demoLead.adapter';
import { DemoLeadService } from './demoLead.service';
import { DemoLeadController } from './demoLead.controller';
import { DemoLeadRepository } from './repo/demoLead.repo';


@Module({
  imports: [TypeOrmModule.forFeature([DemoLeadEntity])],
  providers: [DemoLeadService, DemoLeadAdapter, DemoLeadRepository],
  controllers: [DemoLeadController],
  exports: [DemoLeadRepository, DemoLeadService]
})
export class DemoLeadModule { }
