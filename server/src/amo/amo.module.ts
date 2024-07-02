import { Module } from '@nestjs/common';
import { AmoService } from './amo.service';
import { FilesModule } from 'src/files/files.module';

@Module({
    providers: [AmoService],
    exports: [AmoService],
    imports: [FilesModule]
})
export class AmoModule {}
