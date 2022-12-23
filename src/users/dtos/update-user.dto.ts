import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password?: string;

  @IsString()
  refreshToken?: string;
}
