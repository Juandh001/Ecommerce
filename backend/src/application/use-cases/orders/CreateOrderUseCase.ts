import { OrderRepository } from '../../../domain/repositories/OrderRepository';
import { CartRepository } from '../../../domain/repositories/CartRepository';
import { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { AddressRepository } from '../../../domain/repositories/AddressRepository';
import { CreateOrderData, OrderWithDetails } from '../../../domain/entities/Order';

export interface CreateOrderUseCaseInput {
  userId: string;
  addressId: string;
  paymentMethodId?: string;
  notes?: string;
}

export interface CreateOrderUseCaseOutput {
  order: OrderWithDetails;
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly addressRepository: AddressRepository
  ) {}

  async execute(input: CreateOrderUseCaseInput): Promise<CreateOrderUseCaseOutput> {
    const { userId, addressId, notes } = input;

    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    if (address.userId !== userId) {
      throw new Error('Address does not belong to user');
    }

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    for (const item of cart.items) {
      const productDetails = await this.productRepository.findWithDetails(item.productId);
      
      if (!productDetails?.isActive) {
        throw new Error(`Product ${productDetails?.name} is no longer available`);
      }

      if (productDetails.inventory?.trackQuantity) {
        const availableQuantity = 
          (productDetails.inventory.quantity || 0) - 
          (productDetails.inventory.reservedQuantity || 0);
        
        if (availableQuantity < item.quantity && !productDetails.inventory.allowBackorder) {
          throw new Error(`Insufficient stock for ${productDetails.name}. Only ${availableQuantity} available`);
        }
      }
    }

    for (const item of cart.items) {
      await this.productRepository.reserveInventory(item.productId, item.quantity);
    }

    const subtotal = cart.subtotal;
    const tax = this.calculateTax(subtotal);
    const shipping = this.calculateShipping(subtotal);
    const total = subtotal + tax + shipping;

    const orderData: CreateOrderData = {
      userId,
      addressId,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      tax,
      shipping,
      discount: 0,
      currency: 'USD',
      notes,
    };

    const order = await this.orderRepository.create(orderData);

    await this.cartRepository.clear(userId);

    const orderWithDetails = await this.orderRepository.findWithDetails(order.id);
    if (!orderWithDetails) {
      throw new Error('Failed to retrieve created order');
    }

    return {
      order: orderWithDetails,
    };
  }

  private calculateTax(subtotal: number): number {
    return subtotal * 0.08; // 8% tax rate
  }

  private calculateShipping(subtotal: number): number {
    if (subtotal >= 100) {
      return 0; // Free shipping for orders over $100
    }
    return 9.99;
  }
} 