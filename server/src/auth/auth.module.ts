import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FilesModule } from 'src/files/files.module';

@Module({
    providers: [AuthService],
    exports: [AuthService],
    imports: [FilesModule]
})
export class AuthModule {}
