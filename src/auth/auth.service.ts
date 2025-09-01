import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new NotFoundException('Usuario o Contraseña incorrectos ');
    if (!bcrypt.compareSync(loginDto.password, user.password))
      throw new NotFoundException('Usuario o Contraseña incorrectos');

    return this.jwtService.signAsync({ id: user.id });
  }

  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findByEmail(registerDto.email);
    if (userExists) throw new BadRequestException('El usuario ya existe');
    const user = await this.usersService.register(registerDto);
    return {
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
    };
  }
}
