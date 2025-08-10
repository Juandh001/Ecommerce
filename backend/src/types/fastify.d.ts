import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      iat?: number;
      exp?: number;
    };
  }
} 