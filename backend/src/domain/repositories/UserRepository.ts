import { User, CreateUserData, UpdateUserData } from '../entities/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  findMany(options?: {
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
  }>;
  exists(email: string): Promise<boolean>;
} 