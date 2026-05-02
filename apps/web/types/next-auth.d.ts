// apps/web/types/next-auth.d.ts
// Extend NextAuth types with our custom fields

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    shopId: string | null;
    accessToken: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      shopId: string | null;
      accessToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: string;
    shopId: string | null;
    accessToken: string;
  }
}
