import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import ICredentialsData from 'src/types/ICredentialsData';

@Injectable()
export class FilesService {
    /**
     * Чтение данных из локального файла
     *
     * @param {string} filePath - путь к файлу
     * @returns {Promise<string>} строковое значение данных
     */
    private async getLocalData(filePath: string): Promise<string> {
        const fileExists = async (path: string) => !!(await fs.stat(path).catch(e => false));

        // проверка существования файла с данными
        if (!(await fileExists(filePath))) return null;

        const stringData = await fs.readFile(filePath, 'utf-8');

        if (stringData.length === 0) return null;

        return stringData;
    }

    /**
     * Чтение данных (токенов) из локального json
     * При первом запуске приложения файла не существует, поэтому будет сделан запрос авторизации с сохранением данных в файл
     * Если файл есть, то данные из него считываются для получения токенов
     *
     * @returns {Promise<ICredentialsData>} данные аутентификации
     */
    async getCredentialsData(): Promise<ICredentialsData> {
        const rawData = await this.getLocalData('.credentials.json');
        const jsonData = JSON.parse(rawData);

        return jsonData;
    }

    /**
     * Запись данных аутентификации (токенов) в локальный json-файл
     *
     * @param data - response-данные POST-запроса `https://SUBDOMAIN.amocrm.ru/oauth2/access_token`
     */
    async saveCredentialsData(data: any): Promise<void> {
        return fs.writeFile('.credentials.json', JSON.stringify(data));
    }
}
