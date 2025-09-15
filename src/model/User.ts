import {
  PrismaClient,
  UserRole,
  UserStatus,
} from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const UserSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  lastLogin: true,
};

export const UserPublicSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
};

export class UserModel {
  static async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        ...UserPublicSelect,
      },
    });
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: { ...UserSafeSelect },
    });
  }

  static async findAll(filter?: any) {
    return await prisma.user.findMany({
      where: filter,
      select: { ...UserSafeSelect },
    });
  }
  static async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    status?: UserStatus;
  }) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || UserRole.USER,
        status: data.status || UserStatus.ACTIVE,
      },
      select: { ...UserSafeSelect },
    });
  }

  static async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      passwordHash: string;
      role: UserRole;
      status: UserStatus;
    }>
  ) {
    return await prisma.user.update({
      where: { id },
      data,
      select: { ...UserSafeSelect },
    });
  }

  static async delete(id: number) {
    return await prisma.user.delete({
      where: { id },
      select: { ...UserSafeSelect },
    });
  }
}
