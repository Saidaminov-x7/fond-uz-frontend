import { NextResponse } from "next/server";
import { adminApi } from "@/src/lib/admin-api";
export async function POST() {
  await adminApi("/api/auth/logout", { method: "POST" });
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
