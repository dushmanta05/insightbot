import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateSiteDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  embedCode: string;
}
