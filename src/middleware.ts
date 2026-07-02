import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};

// NextAuth middleware caused `/admin/dashboard` to redirect back to
// `/admin/login` even when the session is valid (role=admin).
// Authorization is handled by the server-side `admin/dashboard/layout.tsx`,
// so middleware should not enforce auth here.
export default function middleware(_request: NextRequest) {
  void _request;
  return NextResponse.next();
}
