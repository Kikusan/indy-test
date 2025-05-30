import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ErrorInterceptor } from './interceptors/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Indy promotion API')
    .setDescription(`Documentation de l'API du test backend`)
    .setVersion('1.0')
    .addTag('promotion')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      cache: false,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ErrorInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
