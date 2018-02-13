import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);

    app.use("/", express.static(__dirname + '/public'));

    await app.listen(3005);
}

bootstrap();
