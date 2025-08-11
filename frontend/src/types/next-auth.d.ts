import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: 'CUSTOMER' | 'ADMIN';
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'CUSTOMER' | 'ADMIN';
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    role?: 'CUSTOMER' | 'ADMIN';
    userId?: string;
  }
} 