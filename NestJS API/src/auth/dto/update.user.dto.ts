import {
  IsEmail,
  IsLowercase,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsLowercase({ message: 'Email do not accepte with upper case' })
  email?: string;

  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(18, { message: 'Full name must be at most 10 characters' })
  fullName?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(12, { message: 'Password must be at most 12 characters' })
  password?: string;
}
