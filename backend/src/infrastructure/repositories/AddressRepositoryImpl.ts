import { PrismaClient } from '@prisma/client';
import { AddressRepository } from '../../domain/repositories/AddressRepository';
import { Address } from '../../domain/entities/Address';

export class AddressRepositoryImpl implements AddressRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    return address ? this.mapToEntity(address) : null;
  }

  async findByUserId(userId: string): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return addresses.map(address => this.mapToEntity(address));
  }

  async create(data: any): Promise<Address> {
    const address = await this.prisma.address.create({
      data,
    });

    return this.mapToEntity(address);
  }

  async update(id: string, data: any): Promise<Address> {
    const address = await this.prisma.address.update({
      where: { id },
      data,
    });

    return this.mapToEntity(address);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: { id },
    });
  }

  private mapToEntity(address: any): Address {
    return {
      id: address.id,
      userId: address.userId,
      title: address.title,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
} 