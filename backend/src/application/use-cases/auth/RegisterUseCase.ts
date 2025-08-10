import bcrypt from 'bcryptjs';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User, CreateUserData, UserRole } from '../../../domain/entities/User';

export interface RegisterUseCaseInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterUseCaseOutput {
  user: Omit<User, 'password'>;
}

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUseCaseInput): Promise<RegisterUseCaseOutput> {
    const { email, password, firstName, lastName, phone } = input;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData: CreateUserData = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim(),
      role: UserRole.CUSTOMER,
    };

    const user = await this.userRepository.create(userData);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
    };
  }
} 