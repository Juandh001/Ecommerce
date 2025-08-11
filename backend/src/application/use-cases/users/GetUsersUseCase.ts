import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';

export interface GetUsersUseCaseInput {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: 'email' | 'firstName' | 'lastName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetUsersUseCaseOutput {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetUsersUseCaseInput = {}): Promise<GetUsersUseCaseOutput> {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = input;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};

    if (search) {
      where.search = search;
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const result = await this.userRepository.findMany({
      skip,
      take,
      where,
      orderBy: {
        field: sortBy,
        direction: sortOrder,
      },
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      users: result.users,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
} 