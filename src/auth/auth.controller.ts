import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  BadRequestException,
  InternalServerErrorException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Auth } from './decorators/auth.decorator';
import { Roles } from './roles.enum';
import { UsersService } from 'src/users/users.service';
import { ActiveUser } from './decorators/activeUser.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @ApiBearerAuth()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const isUserRegistered = await this.userService.findByEmail(
        registerDto.email,
      );
      if (isUserRegistered) {
        throw new BadRequestException('Usuario ya registrado');
      }
      const newUser = await this.authService.register(registerDto);
      return { message: 'Usuario registrado exitosamente', user: newUser };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al registrar usuario',
        error.message,
      );
    }
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
    try {
      const token = await this.authService.login(loginDto);
      const user = await this.userService.findByEmail(loginDto.email);

      await this.userService.updateLastConnection(user.id);
      res.cookie('token', token, { httpOnly: true });
      return res.status(200).json({
        message: 'Login exitoso',
        user: { name: user.name, surname: user.surname, role: user.role },
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @Get('me')
  async me(@ActiveUser() user, @Res() res) {
    try {
      const foundedUser = await this.userService.findById(user.userID);

      if (!foundedUser) {
        return res.clearCookie('token').json({ message: 'logout' });
      }
      return res.json({
        name: foundedUser.name,
        surname: foundedUser.surname,
        role: foundedUser.role,
      });
    } catch (error) {
      throw new NotFoundException({ message: 'Usuario no encontrado', error });
    }
  }

  @Get('logout')
  logout(@Res() res) {
    try {
      return res.clearCookie('token').json({ message: 'logout' });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error al cerrar sesión',
        error,
      });
    }
  }
}
