import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import sensible from '@fastify/sensible';

import { prisma } from './infrastructure/database/prisma';
import { UserRepositoryImpl } from './infrastructure/repositories/UserRepositoryImpl';
import { ProductRepositoryImpl } from './infrastructure/repositories/ProductRepositoryImpl';
import { CartRepositoryImpl } from './infrastructure/repositories/CartRepositoryImpl';

import { RegisterUseCase } from './application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from './application/use-cases/auth/LoginUseCase';
import { GetProductsUseCase } from './application/use-cases/products/GetProductsUseCase';
import { AddToCartUseCase } from './application/use-cases/cart/AddToCartUseCase';

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  },
});

async function bootstrap() {
  try {
    await server.register(sensible);

    await server.register(cors, {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    });

    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });

    await server.register(swagger, {
      swagger: {
        info: {
          title: 'Ecommerce API',
          description: 'Full-featured ecommerce API with authentication, products, cart, and orders',
          version: '1.0.0',
        },
        host: 'localhost:3001',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
          Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'JWT Bearer token',
          },
        },
      },
    });

    await server.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
    });

    const userRepository = new UserRepositoryImpl(prisma);
    const productRepository = new ProductRepositoryImpl(prisma);
    const cartRepository = new CartRepositoryImpl(prisma);

    const registerUseCase = new RegisterUseCase(userRepository);
    const loginUseCase = new LoginUseCase(userRepository);
    const getProductsUseCase = new GetProductsUseCase(productRepository);
    const addToCartUseCase = new AddToCartUseCase(cartRepository, productRepository);

    // Check if decorator already exists to avoid hot reload issues
    if (!server.hasRequestDecorator('user')) {
      server.decorateRequest('user', null);
    }

    server.addHook('preHandler', async (request, reply) => {
      if (request.headers.authorization) {
        try {
          const token = request.headers.authorization.replace('Bearer ', '');
          const decoded = server.jwt.verify(token);
          request.user = decoded;
        } catch (err) {
          // Token is invalid, but we don't throw here - let individual routes handle auth
        }
      }
    });

    // Google OAuth route
    server.post('/api/auth/google', {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'name', 'googleId'],
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            googleId: { type: 'string' },
          },
        },
      },
    }, async (request, reply) => {
      try {
        const { email, name, googleId } = request.body as { 
          email: string; 
          name: string; 
          googleId: string; 
        };

        // Check if user already exists
        let user = await userRepository.findByEmail(email);
        
        if (!user) {
          // Create new user from Google OAuth
          const [firstName, ...lastNameParts] = name.split(' ');
          const lastName = lastNameParts.join(' ') || '';
          
          const registerUseCase = new RegisterUseCase(userRepository);
          const result = await registerUseCase.execute({
            email,
            password: Math.random().toString(36).slice(-8), // Random password for OAuth users
            firstName,
            lastName,
          });
          
          user = result.user;
        }

        // Generate JWT token
        const token = server.jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        });

        reply.code(200).send({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            emailVerified: true, // Google accounts are considered verified
          },
          token,
        });
      } catch (error) {
        console.error('Google OAuth error:', error);
        reply.code(500).send({ error: 'Error en autenticación con Google' });
      }
    });

    // Auth routes
    server.post('/api/auth/register', {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            firstName: { type: 'string', minLength: 1 },
            lastName: { type: 'string', minLength: 1 },
            phone: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  role: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
        },
      },
    }, async (request, reply) => {
      try {
        const result = await registerUseCase.execute(request.body as any);
        const token = server.jwt.sign({ 
          id: result.user.id, 
          email: result.user.email, 
          role: result.user.role 
        });

        reply.code(201).send({
          user: result.user,
          token,
        });
      } catch (error: any) {
        reply.code(400).send({ error: error.message });
      }
    });

    server.post('/api/auth/login', {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  role: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
        },
      },
    }, async (request, reply) => {
      try {
        const result = await loginUseCase.execute(request.body as any);
        const token = server.jwt.sign({ 
          id: result.user.id, 
          email: result.user.email, 
          role: result.user.role 
        });

        reply.send({
          user: result.user,
          token,
        });
      } catch (error: any) {
        reply.code(401).send({ error: error.message });
      }
    });

    // Products routes
    server.get('/api/products', {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            categoryId: { type: 'string' },
            search: { type: 'string' },
            minPrice: { type: 'number', minimum: 0 },
            maxPrice: { type: 'number', minimum: 0 },
            isFeatured: { type: 'boolean' },
            sortBy: { type: 'string', enum: ['name', 'price', 'createdAt', 'popularity'] },
            sortOrder: { type: 'string', enum: ['asc', 'desc'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    price: { type: 'number' },
                    comparePrice: { type: 'number' },
                    shortDescription: { type: 'string' },
                    images: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          url: { type: 'string' },
                          altText: { type: 'string' },
                        },
                      },
                    },
                    category: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                      },
                    },
                    averageRating: { type: 'number' },
                    reviewCount: { type: 'integer' },
                  },
                },
              },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
    }, async (request, reply) => {
      try {
        const query = request.query as any;
        const priceRange = query.minPrice || query.maxPrice ? {
          min: query.minPrice,
          max: query.maxPrice,
        } : undefined;

        const result = await getProductsUseCase.execute({
          page: query.page,
          limit: query.limit,
          categoryId: query.categoryId,
          search: query.search,
          priceRange,
          isFeatured: query.isFeatured,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        });

        reply.send(result);
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    server.get('/api/products/featured', async (request, reply) => {
      try {
        const products = await productRepository.findFeatured(8);
        reply.send({ products });
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    server.get('/api/products/by-slug/:slug', async (request, reply) => {
      try {
        const { slug } = request.params as { slug: string };
        const product = await productRepository.findWithDetailsBySlug(slug);
        
        if (!product) {
          return reply.code(404).send({ error: 'Product not found' });
        }

        reply.send({ product });
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    server.get('/api/products/:id', async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const product = await productRepository.findWithDetails(id);
        
        if (!product) {
          return reply.code(404).send({ error: 'Product not found' });
        }

        reply.send({ product });
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    // Cart routes
    server.get('/api/cart', async (request, reply) => {
      try {
        const user = request.user as { id: string };
        if (!user || !user.id) {
          return reply.code(401).send({ error: 'Authentication required' });
        }

        const cart = await cartRepository.findByUserId(user.id);
        
        if (!cart) {
          const newCart = await cartRepository.create(user.id);
          return reply.send({ cart: { ...newCart, items: [], totalItems: 0, subtotal: 0 } });
        }

        reply.send({ cart });
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    server.post('/api/cart/items', async (request, reply) => {
      try {
        const user = request.user as { id: string };
        if (!user || !user.id) {
          return reply.code(401).send({ error: 'Authentication required' });
        }

        const { productId, quantity } = request.body as { productId: string; quantity: number };

        const cart = await addToCartUseCase.execute({
          userId: user.id,
          productId,
          quantity,
        });

        reply.send(cart);
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    server.put('/api/cart/items/:productId', async (request, reply) => {
      try {
        const user = request.user as { id: string };
        if (!user || !user.id) {
          return reply.code(401).send({ error: 'Authentication required' });
        }

        const { productId } = request.params as { productId: string };
        const { quantity } = request.body as { quantity: number };

        const cart = await cartRepository.updateItem(user.id, productId, { quantity });

        reply.send({ cart });
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    server.delete('/api/cart/items/:productId', async (request, reply) => {
      try {
        const user = request.user as { id: string };
        if (!user || !user.id) {
          return reply.code(401).send({ error: 'Authentication required' });
        }

        const { productId } = request.params as { productId: string };

        const cart = await cartRepository.removeItem(user.id, productId);

        reply.send({ cart });
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    server.delete('/api/cart', async (request, reply) => {
      try {
        const user = request.user as { id: string };
        if (!user || !user.id) {
          return reply.code(401).send({ error: 'Authentication required' });
        }

        await cartRepository.clear(user.id);

        reply.send({ success: true });
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    });

    server.get('/api/health', async (request, reply) => {
      reply.send({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    const port = parseInt(process.env.PORT || '3001');
    const host = '0.0.0.0';

    await server.listen({ port, host });
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📚 API documentation available at http://localhost:${port}/docs`);

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await server.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await server.close();
  await prisma.$disconnect();
  process.exit(0);
}); 