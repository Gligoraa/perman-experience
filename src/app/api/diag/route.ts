import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Check DB Connectivity
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "Configuration looks good",
      database: "Connected successfully",
      userCount,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        hasUrl: !!process.env.NEXTAUTH_URL,
        urlValue: process.env.NEXTAUTH_URL,
      }
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({
      status: "Configuration error",
      error: err.message,
      stack: err.stack,
      hint: "Check if your Vercel Environment Variables (DATABASE_URL) are set correctly with the encoded password.",
    }, { status: 500 });
  }
}
