import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config({
  path: '.env',
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Please create .env file')
  process.exit(1)
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string

  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
  @IsString()
  SECRET_API_KEY: string
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
})
const e = validateSync(configServer)
if (e.length > 0) {
  console.log('cac gia trị không hợp lje')
  const errors = e.map((error) => {
    return {
      property: error.property,
      value: error.value,
      constraints: error.constraints,
    }
  })
  throw errors
}

const envConfig = configServer

export default envConfig
