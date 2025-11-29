// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json([]);

  try {
    const res = await fetch(`http://localhost:5001/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy search error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
