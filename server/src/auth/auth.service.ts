import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthService {
    // инжектим сервис для работы с файлами
    constructor(private filesService: FilesService) {}

    /**
     * Метод аутентификации в amoCRM
     *
     * @returns {Promise<boolean>} статус выполнения аутентификации (успешно/нет)
     */
    async authenticate(): Promise<boolean> {
        console.log('authenticate call');
        try {
            const url = `https://${process.env.SUBDOMAIN}.amocrm.ru/oauth2/access_token`;
            // данные интеграции
            const integrationData = {
                'client_id': process.env.CLIENT_ID,
                'client_secret': process.env.CLIENT_SECRET,
                'redirect_uri': process.env.REDIRECT_URI
            };

            // чтение данных (токенов) из локального json-файла
            const credsData = await this.filesService.getCredentialsData();

            // При наличии данных в credsData "refresh_token" используется для обновления "accessToken"
            if (credsData) {
                integrationData['grant_type'] = 'refresh_token';
                integrationData['refresh_token'] = credsData.refresh_token;
            }
            // При отсутствии данных используется "код авторизации" для получения токенов
            else {
                integrationData['grant_type'] = 'authorization_code';
                integrationData['code'] = process.env.AUTH_CODE;
            }

            // отправляем запрос на авторизацию в интеграции amoCRM
            const response = await axios.post(url, integrationData);

            // запись ответа (токенов) в json-файл
            await this.filesService.saveCredentialsData(response.data);

            return true;
        } catch (error) {
            const code = error.response?.status;
            const message = error.response?.data?.hint;
            console.log('auth error #' + code + ': ' + message);

            if (code < 200 || code > 204) {
                throw new HttpException(
                    {
                        message:
                            'Произошла ошибка при авторизации в системе amoCRM. Проверьте данные в .credentials.json',
                        description: message
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }

            return false;
        }
    }
}
