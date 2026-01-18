
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { REQUEST_USER_KEY } from '../constants/auth.constant';
import envConfig from '../config';

const SECRET_KEY = '1234567890'

@Injectable()
export class ApiKeyGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (apiKey !== envConfig.SECRET_API_KEY) {
            throw new UnauthorizedException();
        }
        return true;
    }
}
