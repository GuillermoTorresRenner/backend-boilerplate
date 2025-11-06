import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase().trim() : value,
  )
  name: string;
}
