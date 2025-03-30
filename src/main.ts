import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  (BigInt.prototype as any).toJSON = function () {
    return this.toString(); // BigInt'i string'e dönüştür
  };

  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL'niz
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger yapılandırması
  const config = new DocumentBuilder()
    .setTitle('Komodo Project Management API')
    .setDescription('API documentation for Komodo Project Management')
    .setVersion('1.0')
    .addBearerAuth() // JWT için Bearer Auth ekler
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI için '/api' endpointini kullanır

  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
}
bootstrap();
