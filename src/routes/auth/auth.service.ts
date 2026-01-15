import { Injectable } from '@nestjs/common';
import { HasingService } from '../../shared/services/hasing.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { RegisterBodyDTO } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(private readonly hashService: HasingService, private readonly prismaService: PrismaService){}
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
}
