import { Module } from '@nestjs/common';
import { LeadsModule } from './leads/leads.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { AmoModule } from './amo/amo.module';
import { StatusesModule } from './statuses/statuses.module';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        // Модуль конфигурации (для работы с переменными окружения)
        // по умолчанию метод forRoot ищет файл ".env"
        //  если название отличается, то нужно передать методу объект со свойством envFilePath: 'cutsomName'
        ConfigModule.forRoot(),
        LeadsModule,
        AuthModule,
        FilesModule,
        AmoModule,
        StatusesModule,
        ContactsModule,
        UsersModule
    ]
})
export class AppModule {}
