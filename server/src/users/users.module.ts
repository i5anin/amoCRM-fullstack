import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AmoModule } from 'src/amo/amo.module';

@Module({
    providers: [UsersService],
    exports: [UsersService],
    imports: [AmoModule]
})
export class UsersModule {}
