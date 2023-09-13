import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
 
export async function middleware(request: NextRequest) {
  const session = request.cookies.get('next-auth.session-token')

  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
 
export const config = {
  matcher: '/profile'
}