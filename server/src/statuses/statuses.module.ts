import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { AmoModule } from 'src/amo/amo.module';

@Module({
    providers: [StatusesService],
    exports: [StatusesService],
    imports: [AmoModule]
})
export class StatusesModule {}
