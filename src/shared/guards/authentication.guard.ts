
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from '../decorators/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';
import { ApiKeyGuard } from './api-key.guard';
import { AUTH_TYPE, ConditionGuard } from '../constants/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    private readonly authGuardMap: Record<string, CanActivate>;

    constructor(
        private readonly reflector: Reflector,
        private readonly accessTokenGuard: AccessTokenGuard,
        private readonly apiKeyGuard: ApiKeyGuard
    ) {
        this.authGuardMap = {
            [AUTH_TYPE.Bearer]: this.accessTokenGuard,
            [AUTH_TYPE.ApiKey]: this.apiKeyGuard,
            [AUTH_TYPE.None]: { canActivate: () => true }
        };
    }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? { authTypes: [AUTH_TYPE.None], options: { condition: ConditionGuard.And } }

        const guards = authTypeValue.authTypes.map((type) => this.authGuardMap[type])
        let error = new UnauthorizedException('Unauthorized')

        if (authTypeValue.options?.condition === ConditionGuard.Or) {
            for (const guard of guards) {
                try {
                    const result = await Promise.resolve(guard.canActivate(context));
                    if (result) {
                        return true;
                    }
                } catch (err) {
                    error = err;
                }
            }
            // Nếu chạy hết vòng lặp mà không return true thì mới throw lỗi cuối cùng
            throw error;
        } else {
            // Logic cho AND: tất cả phải pass
            for (const guard of guards) {
                try {
                    const result = await Promise.resolve(guard.canActivate(context));
                    if (!result) {
                        throw error;
                    }
                } catch (err) {
                    throw err;
                }
            }
            return true;
        }
    }
}
