import { Injectable } from '@nestjs/common';
import { AmoService } from 'src/amo/amo.service';
import IResponsibleUser from 'src/types/IResponsibleUser';

@Injectable()
export class UsersService {
    // инжектим сервис для работы с запросами к amoCRM
    constructor(private amoService: AmoService) {}

    /**
     * Получение список всех состоящих в аккаунте пользователей
     *
     * @returns {Promise<IResponsibleUser[]>} массив пользователей
     */
    async getResponsibleUsers(): Promise<IResponsibleUser[]> {
        try {
            const responseData = await this.amoService.makeAmoGetRequest('users');

            const normalizedUsers: IResponsibleUser[] = [];

            // преобразуем полученные данные в объекты пользователей
            responseData.forEach(el =>
                normalizedUsers.push({
                    id: el.id,
                    name: el.name,
                    email: el.email
                })
            );

            return normalizedUsers;
        } catch (error) {
            console.log('getResponsibleUsers error: ' + error);
        }
    }
}
