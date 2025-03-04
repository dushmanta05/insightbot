import { IsString, IsNotEmpty, IsUUID, IsObject } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  @IsNotEmpty()
  siteId: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsObject()
  @IsNotEmpty()
  request: object;
}
