import { NestFactory } from '@nestjs/core';
import { ValidationPipe, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import glob from 'glob';

// requires all the files which conform to the given pattern and returns the list of defaults exports
function requireDefaults(pattern: string) {
  return glob.sync(pattern, { cwd: __dirname, absolute: true })
    .map(require)
    .map(imported => imported.default);
}

// requires all the controllers in the app
const controllers = requireDefaults('*.module/*-controller.ts');

// requires all the global middlewares in the app
const middleware = requireDefaults('*.module/*-middleware.ts');

@Module({
  controllers
})
class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(cookieParser(), ...middleware).forRoutes('/');
  }
}

export async function bootstrap() {
  await createConnection();
  const app = await NestFactory.create(ApplicationModule);

  // allows for validation to be used
  app.useGlobalPipes(new ValidationPipe());

  // allows for NestJS's auto documentation feature to be used
  const options = new DocumentBuilder().addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/', app, document);

  await app.listen(3000);
}
