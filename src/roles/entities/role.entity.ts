import { Prisma } from '@prisma/client';
export class Role implements Prisma.RoleCreateInput {
  id?: string;
  name: string;
  users?: Prisma.UsersCreateNestedManyWithoutRoleInput;
}
