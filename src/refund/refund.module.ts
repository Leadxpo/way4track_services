import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundEntity } from './entity/refund.entity';
import { RefundController } from './refund.controller';
import { RefundService } from './refund.service';
import { RefundAdapter } from './refund.adapter';
import { RefundRepository } from './repo/refund.repo';
import { OrdersModule } from 'src/orders/orders.module';
import { ClientModule } from 'src/client/client.module';


@Module({
    imports: [TypeOrmModule.forFeature([RefundEntity]),
    forwardRef(() => OrdersModule),
    forwardRef(() => ClientModule),
    ],
    controllers: [RefundController],
    providers: [RefundService, RefundAdapter, RefundRepository],
    exports: [RefundService, RefundAdapter, RefundRepository,]
})
export class RefundModule { }
