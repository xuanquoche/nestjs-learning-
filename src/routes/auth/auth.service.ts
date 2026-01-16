import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { HasingService } from '../../shared/services/hasing.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto';
import { TokenService } from 'src/shared/services/token.service';
import { isUniqueConsstraintError } from 'src/shared/helpers';

@Injectable()
export class AuthService {
    constructor(
        private readonly hashService: HasingService, 
        private readonly prismaService: PrismaService,
        private readonly tokenService: TokenService){}
    async register(body: RegisterBodyDTO){
        try {
            const hashedPassword = await this.hashService.hash(body.password)

            const user = await this.prismaService.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    name: body.name
                }
            })

            return user
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async login(body: LoginBodyDTO){
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!user) {
            throw new UnauthorizedException('Account is not found')
        }

        const isPasswordMatched = await this.hashService.compare(body.password, user.password)

        if (!isPasswordMatched) {
            throw new UnprocessableEntityException([
                {
                    field: 'password',
                    error: 'Invalid password'
                }
            ])
        }

        const tokens = await this.generateTokens({userId: user.id})

        return tokens
    }

    async generateTokens(payload: {userId: number}){
        const [accessToken, refreshToken] = await Promise.all([
           this.tokenService.signAccessToken(payload),
           this.tokenService.signRefreshToken(payload)
        ])

        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

        if (!decodedRefreshToken) {
            throw new UnauthorizedException('Invalid refresh token')
        }   

        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId: payload.userId,
                expiresAt: new Date(decodedRefreshToken.exp * 1000)
            }
        })

        return {
           accessToken,
           refreshToken
       }
    }

    async refreshToken(refreshToken: string){
        try {
            const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

            if (!decodedRefreshToken) {
                throw new UnauthorizedException('Invalid refresh token')
            }   

            await this.prismaService.refreshToken.findUniqueOrThrow({
                where: {
                    token: refreshToken
                }
            })

            await this.prismaService.refreshToken.delete({
                where: {
                    token: refreshToken
                }
            })
            const tokens = await this.generateTokens({userId: decodedRefreshToken.userId})

        return tokens
        } catch (error) {
            if(isUniqueConsstraintError(error)){
                throw new UnprocessableEntityException([
                    {
                        field: 'email',
                        error: 'Email is already in use'
                    }
                ])
            }
            throw error
        }
    }
}
