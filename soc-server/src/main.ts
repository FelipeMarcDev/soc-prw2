import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, PUT, POST',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, X-User-Id',
    credentials: false,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 8000);
  console.log(`SOC server rodando na porta ${process.env.PORT ?? 8000}`);
}
bootstrap();
