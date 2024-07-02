import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AmoModule } from 'src/amo/amo.module';
import { UsersModule } from 'src/users/users.module';
import { StatusesModule } from 'src/statuses/statuses.module';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
    providers: [LeadsService],
    controllers: [LeadsController],
    imports: [AuthModule, AmoModule, UsersModule, StatusesModule, ContactsModule]
})
export class LeadsModule {}
