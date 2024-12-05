import { Global, Module } from '@nestjs/common';
import { LuxonService } from './luxon.service';

@Global()
@Module({
  providers: [LuxonService],
  exports: [LuxonService],
})
export class LuxonModule {}
