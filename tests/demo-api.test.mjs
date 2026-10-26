import assert from "node:assert/strict";
import test from "node:test";

const origin = process.env.DEMO_API_URL || "http://localhost:3000";

async function get(path) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200);
  return response.json();
}

function submit(body) {
  return fetch(`${origin}/api/quiz/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("seeded resources expose readable demo lessons and practice answers", async () => {
  const { items, demo } = await get("/api/materials");
  assert.equal(demo, true);
  for (const id of ["constitution-basics", "number-series", "daily-brief", "reading-comprehension"]) {
    const item = items.find((material) => material.id === id);
    assert.ok(item, `Missing seeded resource: ${id}`);
    assert.equal(typeof item.content, "string");
    assert.ok(item.content.length > 200, `${id} must include a readable lesson`);
    assert.ok(item.content.split("\n\n").length >= 3);
  }
  assert.match(items.find((item) => item.id === "number-series").content, /15\. 16/);
  assert.match(items.find((item) => item.id === "reading-comprehension").content, /Suggested answers/);
});

test("exam listings and public quiz questions load without leaking answer keys", async () => {
  const exams = await get("/api/exams");
  assert.ok(exams.items.some((exam) => exam.id === "demo-ssc-cgl"));
  const quiz = await get("/api/quiz");
  assert.ok(quiz.items.length >= 3);
  for (const question of quiz.items) {
    assert.ok(question.options.length > 1);
    assert.ok(question.options.every((option) => typeof option === "string"));
    assert.equal("correctIndex" in question, false);
    assert.equal("explanation" in question, false);
  }
});

test("all answers are scored and the returned answer key scores a full result", async () => {
  const { items } = await get("/api/quiz");
  const answers = Object.fromEntries(items.map((question) => [question.id, 0]));
  const response = await submit({ answers });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.total, items.length);
  assert.equal(result.review.length, items.length);
  assert.equal(result.correct + result.incorrect, result.total);
  for (const review of result.review) {
    assert.ok(review.correctIndex >= 0 && review.correctIndex < review.options.length);
    answers[review.id] = review.correctIndex;
  }
  const perfect = await submit({ answers });
  assert.equal(perfect.status, 200);
  const scored = await perfect.json();
  assert.equal(scored.score, items.length);
  assert.equal(scored.incorrect, 0);
});

test("missing, unknown, fractional, and out-of-range quiz answers are rejected", async () => {
  const { items } = await get("/api/quiz");
  const valid = Object.fromEntries(items.map((question) => [question.id, 0]));
  for (const answers of [
    {},
    [],
    { ...valid, unknown: 0 },
    { ...valid, [items[0].id]: -1 },
    { ...valid, [items[0].id]: items[0].options.length },
    { ...valid, [items[0].id]: 0.5 },
    { ...valid, [items[0].id]: "0" },
  ]) {
    const response = await submit({ answers });
    assert.equal(response.status, 400, JSON.stringify(answers));
    assert.equal(typeof (await response.json()).error, "string");
  }
  const response = await fetch(`${origin}/api/quiz/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(response.status, 400);
});
