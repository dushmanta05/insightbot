import { Exclude, Expose } from 'class-transformer';

export class SiteResponseDto {
  @Expose()
  id: string;

  @Expose()
  url: string;

  @Expose()
  name: string;

  @Expose()
  embedCode: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
