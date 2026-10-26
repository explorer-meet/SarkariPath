import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("answers" in body) ||
    typeof body.answers !== "object" ||
    body.answers === null ||
    Array.isArray(body.answers)
  ) {
    return NextResponse.json({ error: "Answers must be provided as an object." }, { status: 400 });
  }

  const answers = body.answers as Record<string, unknown>;
  if (
    Object.values(answers).some(
      (answer) => typeof answer !== "number" || !Number.isInteger(answer),
    )
  ) {
    return NextResponse.json({ error: "Answer values must be integer option indexes." }, { status: 400 });
  }

  try {
    const questions = await prisma.quizQuestion.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        prompt: true,
        explanation: true,
        options: {
          orderBy: { sortOrder: "asc" },
          select: { label: true, isCorrect: true },
        },
      },
    });
    const validQuestionIds = new Set(questions.map((question) => question.id));
    const hasUnknownQuestion = Object.keys(answers).some((id) => !validQuestionIds.has(id));
    const hasMissingQuestion = questions.some(
      (question) => !Object.prototype.hasOwnProperty.call(answers, question.id),
    );
    const hasInvalidAnswer = questions.some((question) => {
      const answer = answers[question.id];
      return typeof answer !== "number" || answer < 0 || answer >= question.options.length;
    });
    if (hasUnknownQuestion || hasMissingQuestion || hasInvalidAnswer) {
      return NextResponse.json(
        { error: "Provide one valid answer for every quiz question." },
        { status: 400 },
      );
    }

    const review = questions.map((question) => {
      const correctIndex = question.options.findIndex((option) => option.isCorrect);
      const selectedIndex = answers[question.id] as number;
      return {
        id: question.id,
        prompt: question.prompt,
        options: question.options.map((option) => option.label),
        correctIndex,
        selectedIndex,
        explanation: question.explanation,
      };
    });
    const correct = review.filter((item) => item.selectedIndex === item.correctIndex).length;
    return NextResponse.json({
      score: correct,
      total: questions.length,
      correct,
      incorrect: questions.length - correct,
      review,
    });
  } catch (error) {
    console.error("Failed to score quiz with database questions:", error);
    return NextResponse.json({ error: "Quiz scoring is temporarily unavailable." }, { status: 503 });
  }
}
