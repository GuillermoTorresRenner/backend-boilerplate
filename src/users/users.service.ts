import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.findByEmail(createUserDto.email);
      if (userExists) throw new BadRequestException('El usuario ya existe');

      // Verificar que el role existe
      const roleExists = await this.prismaService.role.findUnique({
        where: { id: createUserDto.roleId },
      });
      if (!roleExists) throw new BadRequestException('El rol no existe');

      const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
      const user = await this.prismaService.users.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        include: {
          role: true, // Incluir información del rol
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error al registrar usuario',
        error,
      });
    }
  }

  async findById(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      include: {
        role: true, // Incluir información del rol
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string) {
    return await this.prismaService.users.findUnique({
      where: {
        email,
      },
      include: {
        role: true, // Incluir información del rol
      },
    });
  }

  async updateLastConnection(id: string) {
    return await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        lastConnection: new Date(),
      },
      include: {
        role: true,
      },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.prismaService.users.update({
      where: { id },
      data: { refreshToken },
      include: {
        role: true,
      },
    });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async HashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
