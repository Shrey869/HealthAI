import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Next.js 16 deprecated middleware.ts in favor of proxy.ts
// We use the edge-compatible authConfig without the Prisma adapter here
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
}
