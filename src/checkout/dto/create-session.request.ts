import { IsString } from 'class-validator'

export class CreateSessionRequest {
  @IsString()
  productId: string
}
