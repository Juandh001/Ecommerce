import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, CreateUserData, UpdateUserData, UserRole } from '../../domain/entities/User';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        role: data.role || UserRole.CUSTOMER,
      },
    });

    return this.mapToEntity(user);
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findMany(options?: {
    skip?: number;
    take?: number;
    where?: {
      isActive?: boolean;
      role?: string;
      email?: string;
    };
    orderBy?: {
      field: string;
      direction: 'asc' | 'desc';
    };
  }): Promise<{
    users: User[];
    total: number;
  }> {
    const where: any = {};
    
    if (options?.where?.isActive !== undefined) {
      where.isActive = options.where.isActive;
    }
    
    if (options?.where?.role) {
      where.role = options.where.role;
    }
    
    if (options?.where?.email) {
      where.email = {
        contains: options.where.email,
        mode: 'insensitive',
      };
    }

    const orderBy: any = {};
    if (options?.orderBy) {
      orderBy[options.orderBy.field] = options.orderBy.direction;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: options?.skip,
        take: options?.take,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map(user => this.mapToEntity(user)),
      total,
    };
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  private mapToEntity(user: any): User {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      role: user.role as UserRole,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 