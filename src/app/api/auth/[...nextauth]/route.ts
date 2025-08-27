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
      role: "USER" | "ADMIN" | "KEPALA_SPPG" | "AHLI_GIZI" | "AKUNTAN" | "ASISTEN_LAPANGAN" | "STAFF_OPERASIONAL" | "DRIVER"
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string | null
    role: "USER" | "ADMIN" | "KEPALA_SPPG" | "AHLI_GIZI" | "AKUNTAN" | "ASISTEN_LAPANGAN" | "STAFF_OPERASIONAL" | "DRIVER"
  }
}

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>>,
      ) {
        try {
          if (!credentials?.email || !credentials?.password || 
              typeof credentials.email !== 'string' || 
              typeof credentials.password !== 'string') {
            return null
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              roles: {
                select: {
                  role: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          })

          if (!user?.password) {
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          const { password, ...userWithoutPassword } = user
          return userWithoutPassword
        } catch (error) {
          console.error("[AUTH_ERROR]", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        const roleName = user.roles[0]?.role.name
        // Map specific roles or default to USER
        const validRoles = ["ADMIN", "KEPALA_SPPG", "AHLI_GIZI", "AKUNTAN", "ASISTEN_LAPANGAN", "STAFF_OPERASIONAL", "DRIVER"] as const
        token.role = validRoles.includes(roleName as typeof validRoles[number]) ? roleName as typeof token.role : "USER"
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
          role: token.role as "USER" | "ADMIN" | "KEPALA_SPPG" | "AHLI_GIZI" | "AKUNTAN" | "ASISTEN_LAPANGAN" | "STAFF_OPERASIONAL" | "DRIVER"
        }
      }
    }
  }
}

export const { handlers: { GET, POST }, auth } = NextAuth(config)
