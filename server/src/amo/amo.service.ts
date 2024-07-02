import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AmoService {
    // инжектим сервис для работы с файлами
    constructor(private filesService: FilesService) {}

    /**
     * Helper-функция для выполнения GET-запроса к amoCRM для получения данных
     *
     * @param {string} endpoint - интересующий эндпоинт
     * @param {string} params - параметры
     * @param {boolean} destruct - нужно ли доставать данные из **_embedded[endpoint]** или брать само свойство **_embedded** (по дефолту - первое)
	 * * для эндпоинтов "leads"/"users"/"contacts" данные лежат в свойстве ответа _embedded[endpoint] (например, для сделок - в _embedded.leads)
	 * * но для статусов сделок эндпоинт - "leads/pipelines", а данные лежат в _embedded.statuses
	 * * т.о. по дефолту данные будут браться из _embedded[endpoint], но для статусов будет возвращаться свойство _embedded, и обрабатываться уже в сервисе статусов 

     * @returns {Promise<any>} данные запрашиваемых сущностей (например, массив сделок)
     */
    async makeAmoGetRequest(endpoint: string, params: string = '', destruct: boolean = true): Promise<any> {
        const url = `https://${process.env.SUBDOMAIN}.amocrm.ru/api/v4/${endpoint}${params}`;

        // получаем accessToken из локального JSON-файла
        const accessToken = (await this.filesService.getCredentialsData())?.access_token;

        // делаем запрос с токеном в Auth-хэдере
        const response = await axios.get(url, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        return destruct ? response.data._embedded[endpoint] : response.data._embedded;
    }
}
