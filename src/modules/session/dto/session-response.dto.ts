import { Exclude, Expose } from 'class-transformer';

export class SessionResponseDto {
  @Expose()
  id: string;

  @Expose()
  siteId: string;

  @Expose()
  key: string;

  @Exclude()
  request: object;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
