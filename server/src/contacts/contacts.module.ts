import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { AmoModule } from 'src/amo/amo.module';

@Module({
    providers: [ContactsService],
    exports: [ContactsService],
    imports: [AmoModule]
})
export class ContactsModule {}
