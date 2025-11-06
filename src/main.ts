import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Agrega esta línea para establecer el prefijo global
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilita la transformación automática
      whitelist: true, // Solo permite propiedades definidas en el DTO
      transformOptions: {
        enableImplicitConversion: true, // Permite conversión implícita de tipos
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Otaria backend Api Docs')
    .setDescription(
      'Documentación de los endpoints de la aplicación Otaria Hellas de Carbono',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
