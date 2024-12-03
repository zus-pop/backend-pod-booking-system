import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Configs
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Pod Booking API')
    .setDescription('The Pod Booking API description')
    .setVersion('2.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v2/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
