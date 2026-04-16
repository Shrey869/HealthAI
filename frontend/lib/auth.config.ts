import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  providers: [], // Keep empty here, add real providers in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedRoutes = ["/dashboard"]
      const isProtected = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      )

      if (isProtected) {
        if (isLoggedIn) return true
        return false // Redirect to signIn
      } else if (isLoggedIn) {
        const authRoutes = ["/auth/signin", "/auth/signup"]
        if (authRoutes.includes(nextUrl.pathname)) {
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
