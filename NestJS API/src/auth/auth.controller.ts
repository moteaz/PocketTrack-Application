import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Get,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorator/get-user.decorator';
import { createMulterOptions } from '../config/multer.config';
import { CleanupUploadInterceptor } from '../common/interceptors/cleanup-upload.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @UseInterceptors(
    FileInterceptor('profilePic', createMulterOptions()),
    new CleanupUploadInterceptor(),
  )
  async register(
    @Body(new ValidationPipe({ transform: true })) dto: RegisterDto,
    @UploadedFile() profilePic?: Express.Multer.File,
  ) {
    const profilePicPath = profilePic ? profilePic.filename : undefined;
    return this.authService.register({ ...dto, profilePic: profilePicPath });
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@GetUser('id') userId: number) {
    return this.authService.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  @UseInterceptors(
    FileInterceptor('profilePic', createMulterOptions()),
    new CleanupUploadInterceptor(),
  )
  async updateProfile(
    @GetUser('id') userId: number,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateUserDto,
    @UploadedFile() profilePic?: Express.Multer.File,
  ) {
    const profilePicPath = profilePic ? profilePic.filename : undefined;
    return this.authService.updateUser(userId, {
      ...dto,
      profilePic: profilePicPath,
    });
  }
}
