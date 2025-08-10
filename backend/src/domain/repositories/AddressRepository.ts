import { Address, CreateAddressData, UpdateAddressData } from '../entities/Address';

export interface AddressRepository {
  findById(id: string): Promise<Address | null>;
  findByUserId(userId: string): Promise<Address[]>;
  findDefaultByUserId(userId: string): Promise<Address | null>;
  create(userId: string, data: CreateAddressData): Promise<Address>;
  update(id: string, data: UpdateAddressData): Promise<Address>;
  delete(id: string): Promise<void>;
  setAsDefault(userId: string, addressId: string): Promise<Address>;
} 