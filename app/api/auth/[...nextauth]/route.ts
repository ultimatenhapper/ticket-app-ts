import { signInEmailPassword } from "@/auth/actions/auth-actions";
import prisma from "@/prisma/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role, User } from "@prisma/client";
import { Awaitable, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

type ExtendedUser = User & {
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID ?? "",
    //   clientSecret: process.env.GITHUB_SECRET ?? "",
    // }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: {
    //       label: "Email",
    //       type: "email",
    //       placeholder: "usuario@email.com",
    //     },
    //     password: {
    //       label: "Password",
    //       type: "password",
    //       placeholder: "******",
    //     },
    //   },
    //   async authorize(credentials, req) {
    //     const user = await signInEmailPassword(
    //       credentials!.email,
    //       credentials!.password
    //     );

    //     if (user) {
    //       const mappedUser: ExtendedUser = {
    //         ...user,
    //         roles: user.roles,
    //         isActive: user.isActive,
    //         createdAt: user.createdAt,
    //         updatedAt: user.updatedAt,
    //       };

    //       return mappedUser;
    //     }

    //     return;
    //   },
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user, account, profile }): Promise<JWT> {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? "no-email" },
      });
      if (dbUser?.isActive === false) {
        throw new Error("Usuario no está activo");
      }
      token.roles = dbUser?.roles ?? ["no-roles"];
      token.id = dbUser?.id ?? "no-uuid";

      return token;
    },
    async session({ session, token, user }) {
      if (session && session.user) {
        session.user.roles = token.roles;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
