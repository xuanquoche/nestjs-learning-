import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HasingService } from './services/hasing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/access-token.guard';
import { ApiKeyGuard } from './guards/api-key.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';

const sharedServices = [PrismaService, HasingService, TokenService]

@Global()
@Module({
  providers: [...sharedServices, AccessTokenGuard, ApiKeyGuard, {
    provide: APP_GUARD,
    useClass: AuthenticationGuard
  }],
  exports: sharedServices,
  imports: [JwtModule]

})
export class SharedModule { }
