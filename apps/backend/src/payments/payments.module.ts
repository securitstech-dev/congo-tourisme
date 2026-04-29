import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MtnMomoProvider } from './providers/mtn-momo.provider';

@Module({
  providers: [PaymentsService, MtnMomoProvider],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
