import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
