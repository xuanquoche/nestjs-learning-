import { IsString } from "class-validator"

export class LoginBodyDTO {
    @IsString()
    email: string
    @IsString()
    password: string
}

export class RegisterBodyDTO extends LoginBodyDTO {
    @IsString()
    name: string
}

export class RegisterResDTO {
    id: number
    email: string
    name: string
    password: string
    createdAt: Date
    updatedAt: Date
}
