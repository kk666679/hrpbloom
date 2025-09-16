import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = [
  "/dashboard",
  "/employees",
  "/payroll",
  "/leaves",
  "/documents",
  "/settings",
  "/employee-portal",
]

const publicRoutes = ["/login", "/signup", "/", "/api/auth/login", "/api/auth/logout"]

// Minimal JWT verification (Edge runtime safe)
async function verifyJwt(token: string): Promise<any | null> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(process.env.JWT_SECRET || "demo-secret"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const [header, payload, signature] = token.split(".")
    if (!header || !payload || !signature) return null

    const data = `${header}.${payload}`
    const signatureBytes = Uint8Array.from(atob(signature.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0))

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(data)
    )

    if (!valid) return null

    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtectedRoute) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const user = await verifyJwt(token)
    if (!user) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", user.id?.toString() ?? "")
    requestHeaders.set("x-user-role", user.role ?? "")

    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
