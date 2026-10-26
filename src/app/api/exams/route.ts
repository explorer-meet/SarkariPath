import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.exam.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        organization: true,
        category: true,
        status: true,
        dateLabel: true,
        dateDetail: true,
        verified: true,
        sourceLabel: true,
        sourceUrl: true,
        isDemo: true,
      },
    });
    return NextResponse.json({ items, demo: items.some((item) => item.isDemo) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load exams from the database:", error);
    return NextResponse.json({ error: "Exam listings are temporarily unavailable." }, { status: 503 });
  }
}
