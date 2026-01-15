import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { TransformInterceptor } from './shared/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      return new UnprocessableEntityException(errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints as any).join(', ')
      })))
    },
    whitelist: true, // tự động loại bỏ các field khong được khai báo decorator 
    //nếu có field không được khai báo decorator trong DTO mà client truyền lên thì sẽ báo lỗi
    forbidNonWhitelisted: true, 
    // tự động chuyển hóa dữ liệu theo type trong DTO
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
