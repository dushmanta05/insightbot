import { IsNotEmpty, IsUUID, IsObject } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  @IsNotEmpty()
  siteId: string;

  @IsObject()
  @IsNotEmpty()
  request: object;
}
