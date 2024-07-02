import { Injectable } from '@nestjs/common';
import { AmoService } from 'src/amo/amo.service';
import IContact from 'src/types/IContact';

@Injectable()
export class ContactsService {
    // инжектим сервис для работы с запросами к amoCRM
    constructor(private amoService: AmoService) {}

    /**
     * Получение всех контактов
     *
     * @returns {Promise<IContact[]>} массив контактов
     */
    async getAllContacts(): Promise<IContact[]> {
        try {
            const responseData = await this.amoService.makeAmoGetRequest('contacts');

            const normalizedContacts: IContact[] = [];

            // преобразуем полученные данные в объекты контактов
            responseData.forEach(el => {
                const email = el.custom_fields_values?.find(field => field.field_code === 'EMAIL');
                const phone = el.custom_fields_values?.find(field => field.field_code === 'PHONE');

                normalizedContacts.push({
                    id: el.id,
                    name: el.name,
                    email: email?.values[0].value,
                    phone: phone?.values[0].value
                });
            });

            return normalizedContacts;
        } catch (error) {
            console.log('getContacts error: ' + error);
        }
    }
}
