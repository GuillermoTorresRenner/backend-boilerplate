import { Prisma } from '@prisma/client';

export class User implements Prisma.UsersCreateInput {
  id?: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  lastConnection?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  refreshToken?: string;
  roleId: string; // Agregar roleId
  role: Prisma.RoleCreateNestedOneWithoutUsersInput;
}
