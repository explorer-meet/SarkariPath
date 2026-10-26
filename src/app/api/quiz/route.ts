import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.quizQuestion.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        prompt: true,
        isDemo: true,
        options: {
          orderBy: { sortOrder: "asc" },
          select: { label: true },
        },
      },
    });
    const items = questions.map(({ options, ...question }) => ({
      ...question,
      options: options.map((option) => option.label),
    }));
    return NextResponse.json(
      { items, demo: questions.some((question) => question.isDemo) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to load quiz questions from the database:", error);
    return NextResponse.json({ error: "Quiz questions are temporarily unavailable." }, { status: 503 });
  }
}
