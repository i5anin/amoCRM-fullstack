import { Injectable } from '@nestjs/common';
import { AmoService } from 'src/amo/amo.service';
import IStatus from 'src/types/IStatus';

@Injectable()
export class StatusesService {
    // инжектим сервис для работы с запросами к amoCRM
    constructor(private amoService: AmoService) {}

    /**
     * Получение всех статусов сделок
     *
     * @returns {Promise<IStatus[]>} массив статусов
     */
    async getAllStatuses(): Promise<IStatus[]> {
        try {
            const { pipelines } = await this.amoService.makeAmoGetRequest('leads/pipelines', '', false);

            const normalizedStatuses: IStatus[] = [];

            // преобразуем полученные данные в объекты статусов сделки
            pipelines.forEach(pipeline => {
                pipeline._embedded.statuses.forEach(status => {
                    normalizedStatuses.push({
                        id: status.id,
                        name: status.name,
                        color: status.color
                    });
                });
            });

            return normalizedStatuses;
        } catch (error) {
            console.log('getAllStatuses error: ' + error);
        }
    }
}
