import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ILead from 'src/types/ILead';
import { AuthService } from 'src/auth/auth.service';
import { AmoService } from 'src/amo/amo.service';
import { UsersService } from 'src/users/users.service';
import { StatusesService } from 'src/statuses/statuses.service';
import { ContactsService } from 'src/contacts/contacts.service';

@Injectable()
export class LeadsService {
    // инжектим сервисы
    constructor(
        private authService: AuthService, // для работы с аутентификацией
        private amoService: AmoService, // для работы с запросами к amoCRM
        private usersService: UsersService, // для получения ответственных за сделку
        private statusesService: StatusesService, // для получения статусов сделок
        private contactsService: ContactsService // для получения контактов сделки
    ) {}

    /**
     * Получение всех сделок
     *
     * @param {string} query - Поисковый запрос (Осуществляет поиск по заполненным полям сущности)
     *
     * @returns {Promise<ILead[]>} массив сделок
     */
    async getLeads(query: string): Promise<ILead[]> {
        try {
            const leadsArray = await this.amoService.makeAmoGetRequest('leads', `?query=${query}&with=contacts`);

            // также делаем 3 запроса для получения доп.данных о сделке (ответственный за сделку; статус сделки; контакты)
            const allResponsibles = await this.usersService.getResponsibleUsers();
            const allStatuses = await this.statusesService.getAllStatuses();
            const allContacts = await this.contactsService.getAllContacts();

            const normalizedLeads: ILead[] = [];

            // преобразуем полученные данные в объекты сделок с доп.полями
            leadsArray.forEach(lead => {
                const leadContacts = lead._embedded.contacts.map(contact => allContacts.find(c => contact.id === c.id));
                const leadStatus = allStatuses.find(status => status.id === lead.status_id);
                const leadResponsible = allResponsibles.find(user => user.id === lead.responsible_user_id);

                normalizedLeads.push({
                    id: lead.id,
                    name: lead.name,
                    price: lead.price,
                    responsible_user: leadResponsible,
                    status: leadStatus,
                    created_at: new Date(lead.created_at * 1000).toISOString(),
                    contacts: leadContacts
                });
            });

            return normalizedLeads;
        } catch (error) {
            const code = error.response?.status;

            // 401 - Unauthorized
            if (code === 401) {
                console.log('Unauthorized. Try to Auth');
                // попытка авторизоваться в интеграции amoCRM (используя данные из .credentials.json с их последующей перезаписью)
                const result = await this.authService.authenticate();
                if (!result)
                    throw new HttpException(
                        'Ошибка при авторизации в системе amoCRM. Повторите попытку позже',
                        HttpStatus.UNAUTHORIZED
                    );

                // повторный вызов запроса
                return this.getLeads(query);
            }

            return [];
        }
    }
}
