import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as compression from 'compression';
import { config } from 'dotenv';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

const ACCESS_CONTROL_MAX_AGE = 86400;
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(express()),
    {
      bodyParser: false,
      cors: true,
    },
  );
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With,content-type',
      'Origin',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
    maxAge: ACCESS_CONTROL_MAX_AGE,
  });

  app.use(compression());

  await app.listen(3000);
}

bootstrap();
