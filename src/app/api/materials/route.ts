import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.studyMaterial.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        subject: true,
        detail: true,
        content: true,
        type: true,
        duration: true,
        premium: true,
        isDemo: true,
      },
    });
    return NextResponse.json({ items, demo: items.some((item) => item.isDemo) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load study materials from the database:", error);
    return NextResponse.json({ error: "Study materials are temporarily unavailable." }, { status: 503 });
  }
}
