import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function start() {
    const PORT = process.env.PORT || 3000; // указыаем порт, на котором будет работать приложение
    const app = await NestFactory.create(AppModule); // // создаем экземпляр приложения

    app.setGlobalPrefix('api'); // устанавливаем глобальный префикс для обращения к серверу (http://localhost::3000/api)
    app.enableCors();

    await app.listen(PORT, () => console.log('Server started on port ' + PORT)); // запускаем приложение
}

// запуск приложения
start();
