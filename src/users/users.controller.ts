import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth([Roles.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // TODO: Implementar método update en UsersService
    return `This action updates a #${id} user`;
  }

  @Delete(':id')
  @Auth([Roles.ADMIN])
  remove(@Param('id') id: string) {
    // TODO: Implementar método remove en UsersService
    return `This action removes a #${id} user`;
  }
}
