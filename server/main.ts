import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);

    app.use("/", express.static(__dirname + '/'));

    await app.listen(3000);
    console.log('[Nest] listening on port 3000');
}

bootstrap();
