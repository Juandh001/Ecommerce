import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      emailVerified: true,
    },
  });

  // Create customer address
  await prisma.address.create({
    data: {
      userId: customer.id,
      title: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1234567890',
      isDefault: true,
    },
  });

  // Create categories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      isActive: true,
      sortOrder: 1,
    },
  });

  const phonesCategory = await prisma.category.create({
    data: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      parentId: electronicsCategory.id,
      isActive: true,
      sortOrder: 1,
    },
  });

  const laptopsCategory = await prisma.category.create({
    data: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Portable computers',
      parentId: electronicsCategory.id,
      isActive: true,
      sortOrder: 2,
    },
  });

  const clothingCategory = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      isActive: true,
      sortOrder: 2,
    },
  });

  // Create products
  const products = [
    {
      name: 'Zapatillas Urban Flow',
      slug: 'zapatillas-urban-flow',
      description: 'Zapatillas urbanas perfectas para el street style colombiano. Cómodas y con un diseño que marca la diferencia en las calles.',
      shortDescription: 'Zapatillas urbanas que definen tu flow callejero',
      sku: 'URB-FLOW-42',
      price: 299900,
      comparePrice: 359900,
      categoryId: clothingCategory.id,
      isActive: true,
      isFeatured: true,
      tags: ['urban', 'streetwear', 'zapatillas', 'colombia'],
      inventory: { quantity: 85, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&q=80', altText: 'Zapatillas Urban Flow vista frontal' },
        { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop&q=80', altText: 'Zapatillas Urban Flow lateral' },
      ],
    },
    {
      name: 'Camiseta Street Vibes',
      slug: 'camiseta-street-vibes',
      description: 'Camiseta 100% algodón con diseños exclusivos que representan el flow urbano colombiano. Perfecta para parceros que saben de estilo.',
      shortDescription: 'Camiseta que expresa tu vibe callejero auténtico',
      sku: 'STR-VIB-L',
      price: 89900,
      comparePrice: 119900,
      categoryId: clothingCategory.id,
      isActive: true,
      isFeatured: true,
      tags: ['streetwear', 'camiseta', 'urban', 'colombia'],
      inventory: { quantity: 120, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80', altText: 'Camiseta Street Vibes negra' },
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f37f8e7a?w=500&h=500&fit=crop&q=80', altText: 'Camiseta Street Vibes diseño' },
      ],
    },
    {
      name: 'Gorra Urban Colombia',
      slug: 'gorra-urban-colombia',
      description: 'Gorra snapback con bordado exclusivo que celebra el orgullo urbano colombiano. El complemento perfecto para tu look callejero.',
      shortDescription: 'Gorra que corona tu estilo urbano con orgullo patrio',
      sku: 'URB-COL-CAP',
      price: 79900,
      categoryId: clothingCategory.id,
      isActive: true,
      isFeatured: true,
      tags: ['gorra', 'urban', 'colombia', 'streetwear'],
      inventory: { quantity: 95, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&q=80', altText: 'Gorra Urban Colombia frontal' },
        { url: 'https://images.unsplash.com/photo-1575428652377-a02d8929111a?w=500&h=500&fit=crop&q=80', altText: 'Gorra Urban Colombia lateral' },
      ],
    },
    {
      name: 'Mochila Street Pack',
      slug: 'mochila-street-pack',
      description: 'Mochila resistente y funcional diseñada para la vida urbana. Perfecta para parceros que viven el día a día en las calles con estilo.',
      shortDescription: 'Mochila urbana para llevar tu flow a todas partes',
      sku: 'STR-PACK-BLK',
      price: 149900,
      categoryId: clothingCategory.id,
      isActive: true,
      isFeatured: true,
      tags: ['mochila', 'urban', 'streetwear', 'funcional'],
      inventory: { quantity: 65, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80', altText: 'Mochila Street Pack completa' },
        { url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=500&h=500&fit=crop&q=80', altText: 'Mochila Street Pack detalles' },
      ],
    },
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
      shortDescription: 'Premium smartphone with cutting-edge technology',
      sku: 'IPH15PRO-128',
      price: 999.99,
      comparePrice: 1099.99,
      categoryId: phonesCategory.id,
      isActive: true,
      isFeatured: false,
      tags: ['apple', 'smartphone', 'premium'],
      inventory: { quantity: 50, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', altText: 'iPhone 15 Pro front view' },
        { url: 'https://images.unsplash.com/photo-1571442463800-1337d7af9d2f?w=500', altText: 'iPhone 15 Pro back view' },
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Flagship Android phone with S Pen, incredible cameras, and powerful performance.',
      shortDescription: 'Ultimate Android smartphone experience',
      sku: 'SGS24U-256',
      price: 1199.99,
      categoryId: phonesCategory.id,
      isActive: true,
      isFeatured: false,
      tags: ['samsung', 'android', 'smartphone'],
      inventory: { quantity: 30, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', altText: 'Galaxy S24 Ultra' },
      ],
    },
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Professional laptop with M3 Max chip, stunning Liquid Retina XDR display.',
      shortDescription: 'High-performance laptop for professionals',
      sku: 'MBP16-M3MAX',
      price: 2499.99,
      categoryId: laptopsCategory.id,
      isActive: true,
      isFeatured: false,
      tags: ['apple', 'laptop', 'professional'],
      inventory: { quantity: 15, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500', altText: 'MacBook Pro' },
      ],
    },
    {
      name: 'Dell XPS 13',
      slug: 'dell-xps-13',
      description: 'Ultra-portable laptop with InfinityEdge display and premium build quality.',
      shortDescription: 'Compact and powerful ultrabook',
      sku: 'DXPS13-I7',
      price: 1299.99,
      categoryId: laptopsCategory.id,
      isActive: true,
      isFeatured: false,
      tags: ['dell', 'laptop', 'ultrabook'],
      inventory: { quantity: 25, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', altText: 'Dell XPS 13' },
      ],
    },
    {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Comfortable running shoes with Max Air cushioning and breathable mesh.',
      shortDescription: 'Stylish and comfortable sneakers',
      sku: 'NAM270-BLK-42',
      price: 159.99,
      categoryId: clothingCategory.id,
      isActive: true,
      isFeatured: false,
      tags: ['nike', 'shoes', 'running'],
      inventory: { quantity: 100, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', altText: 'Nike Air Max 270' },
      ],
    },
    {
      name: 'Levi\'s 501 Jeans',
      slug: 'levis-501-jeans',
      description: 'Classic straight-fit jeans with the original button fly.',
      shortDescription: 'Iconic denim jeans',
      sku: 'LV501-BLU-32',
      price: 89.99,
      categoryId: clothingCategory.id,
      isActive: true,
      isFeatured: false,
      tags: ['levis', 'jeans', 'denim'],
      inventory: { quantity: 75, trackQuantity: true },
      images: [
        { url: 'https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=500', altText: 'Levi\'s 501 Jeans' },
      ],
    },
  ];

  for (const productData of products) {
    const { inventory, images, ...productFields } = productData;
    
    const product = await prisma.product.create({
      data: productFields,
    });

    // Create inventory
    await prisma.inventory.create({
      data: {
        productId: product.id,
        ...inventory,
      },
    });

    // Create images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i].url,
          altText: images[i].altText,
          sortOrder: i + 1,
        },
      });
    }
  }

  // Create some reviews
  const allProducts = await prisma.product.findMany();
  
  const reviews = [
    { rating: 5, title: 'Excellent product!', comment: 'Love this product, exceeded my expectations.' },
    { rating: 4, title: 'Very good', comment: 'Great quality, fast shipping.' },
    { rating: 5, title: 'Amazing!', comment: 'Perfect for my needs, highly recommend.' },
    { rating: 4, title: 'Good value', comment: 'Good quality for the price.' },
  ];

  for (const product of allProducts.slice(0, 4)) {
    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: product.id,
        rating: reviews[Math.floor(Math.random() * reviews.length)].rating,
        title: reviews[Math.floor(Math.random() * reviews.length)].title,
        comment: reviews[Math.floor(Math.random() * reviews.length)].comment,
        isVerified: true,
        isVisible: true,
      },
    });
  }

  // Create cart for customer
  const cart = await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  });

  // Add some items to cart
  const firstProduct = allProducts[0];
  const secondProduct = allProducts[1];

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: firstProduct.id,
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: secondProduct.id,
      quantity: 2,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Created:');
  console.log('👥 Users: 2 (1 admin, 1 customer)');
  console.log('📦 Categories: 4');
  console.log('🛍️ Products: 6');
  console.log('⭐ Reviews: 4');
  console.log('🛒 Cart items: 2');
  
  console.log('\n🔑 Login credentials:');
  console.log('Admin: admin@ecommerce.com / admin123');
  console.log('Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 