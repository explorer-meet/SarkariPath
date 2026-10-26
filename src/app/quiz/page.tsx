"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";

type QuizPrompt = { id: string; prompt: string; options: string[] };
type ReviewItem = QuizPrompt & {
  correctIndex: number;
  selectedIndex: number | null;
  explanation: string;
};
type ScoreResult = {
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  review: ReviewItem[];
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizPrompt[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quiz")
      .then(async (response) => {
        if (!response.ok) throw new Error("The quiz couldn't be loaded. Please refresh and try again.");
        const payload = (await response.json()) as { items: QuizPrompt[] };
        if (!cancelled) setQuestions(payload.items);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "The quiz couldn't be loaded.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function submitQuiz() {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/quiz/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selected }),
      });
      if (!response.ok) throw new Error("We couldn't score your answers. Please try again.");
      setResult((await response.json()) as ScoreResult);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-intro quiz-intro">
        <p className="eyebrow">A LITTLE PRACTICE GOES A LONG WAY</p>
        <h1>Daily Polity quiz</h1>
        <p>Three quick questions to warm up your revision. Take your time — this is your space to learn.</p>
      </section>
      <div className="quiz-progress-card"><span className="quiz-progress-icon"><Icon name="clock" size={19} /></span><div><strong>3 questions · No timer</strong><span>Choose one answer for each question, then see your results.</span></div><span className="soft-tag">PRACTICE</span></div>
      {result ? (
        <section className="result-card">
          <div className="result-circle"><strong>{result.score}</strong><span>/{result.total}</span></div>
          <p className="eyebrow">NICE WORK SHOWING UP</p>
          <h2>{result.correct} correct {result.correct === 1 ? "answer" : "answers"}</h2>
          <p>You got {result.incorrect} {result.incorrect === 1 ? "question" : "questions"} to revisit. Every attempt is progress.</p>
          <div className="result-actions"><button className="button button-green" onClick={() => { setResult(null); setSelected({}); }} type="button">Try again</button><Link className="button button-outline" href="/study">Back to study room</Link></div>
          <div className="answer-review">
            {result.review.map((item, index) => (
              <article key={item.id}>
                <span className="eyebrow">QUESTION 0{index + 1}</span>
                <h3>{item.prompt}</h3>
                <p><strong>Answer:</strong> {item.options[item.correctIndex]}</p>
                <p>{item.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        loading ? <div className="loading-state">Preparing your quiz…</div> : questions.length === 0 ? <p className="form-error" role="alert">{error || "No questions are available right now."}</p> : <div className="question-list">
          {questions.map((question, index) => (
            <fieldset className="question-card" key={question.id}>
              <legend><span className="question-number">0{index + 1}</span>{question.prompt}</legend>
              <div className="answer-options">
                {question.options.map((option, optionIndex) => (
                  <label className={`answer-option${selected[question.id] === optionIndex ? " chosen" : ""}`} key={option}>
                    <input checked={selected[question.id] === optionIndex} name={question.id} onChange={() => setSelected({ ...selected, [question.id]: optionIndex })} type="radio" />
                    <span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>
                    {selected[question.id] === optionIndex && <Icon name="check" size={17} />}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="quiz-submit-row"><span>{Object.keys(selected).length} of {questions.length} answered</span><button className="button button-green" disabled={submitting || Object.keys(selected).length !== questions.length} onClick={submitQuiz} type="button">{submitting ? "Checking…" : "See my results"} <Icon name="arrow" size={16} /></button></div>
        </div>
      )}
    </>
  );
}
