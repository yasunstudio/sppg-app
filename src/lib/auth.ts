import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

declare module "next-auth" {
  interface User {
    id: string
    email: string | null
    name: string | null
    roles: {
      role: {
        name: string
      }
    }[]
  }
  
  interface Session {
    user: {
      id: string
      email: string | null
      name: string | null
      roles: {
        role: {
          name: string
        }
      }[]
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string | null
    roles: {
      role: {
        name: string
      }
    }[]
  }
}

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          },
          include: {
            roles: {
              include: {
                role: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password as string, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: token.name,
          roles: token.roles
        }
      }
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
