import { CartRepository } from '../../../domain/repositories/CartRepository';
import { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { CartWithItems, AddToCartData } from '../../../domain/entities/Cart';

export interface AddToCartUseCaseInput {
  userId: string;
  productId: string;
  quantity: number;
}

export interface AddToCartUseCaseOutput {
  cart: CartWithItems;
}

export class AddToCartUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async execute(input: AddToCartUseCaseInput): Promise<AddToCartUseCaseOutput> {
    const { userId, productId, quantity } = input;

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.isActive) {
      throw new Error('Product is not available');
    }

    const productWithInventory = await this.productRepository.findWithDetails(productId);
    
    if (productWithInventory?.inventory?.trackQuantity) {
      const availableQuantity = productWithInventory.inventory.quantity || 0;
      
      if (availableQuantity < quantity && !productWithInventory.inventory.allowBackorder) {
        throw new Error(`Only ${availableQuantity} items available in stock`);
      }
    }

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      await this.cartRepository.create(userId);
    }

    const addToCartData: AddToCartData = {
      productId,
      quantity,
    };

    const updatedCart = await this.cartRepository.addItem(userId, addToCartData);

    return {
      cart: updatedCart,
    };
  }
} 