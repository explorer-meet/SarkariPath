import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { getQuiz, scoreQuiz, type QuizQuestion, type QuizResult } from "../api";
import { DemoNotice, EmptyState, ErrorState, LoadingState, SolidButton, Surface } from "../components";
import { colors, common } from "../theme";

export function QuizScreen() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      setQuestions(await getQuiz());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unexpected backend error.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      setResult(await scoreQuiz(answers));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't score the quiz.");
    } finally {
      setSubmitting(false);
    }
  }

  const allAnswered = questions.length > 0 && questions.every((question) => answers[question.id] !== undefined);

  return (
    <ScrollView
      contentContainerStyle={common.scroll}
      refreshControl={<RefreshControl colors={[colors.green]} refreshing={loading} onRefresh={() => void load()} />}
      showsVerticalScrollIndicator={false}
    >
      <Text style={common.eyebrow}>A LITTLE PRACTICE GOES A LONG WAY</Text>
      <Text style={[common.heading, styles.title]}>Daily Polity quiz</Text>
      <Text style={[common.body, styles.subtitle]}>Three questions to warm up your revision. No pressure — this is your space to learn.</Text>
      <DemoNotice compact />
      <View style={styles.quizMeta}>
        <Text style={styles.metaIcon}>◷</Text>
        <View style={styles.metaCopy}>
          <Text style={styles.metaTitle}>{questions.length || 3} questions · No timer</Text>
          <Text style={styles.metaSubtitle}>Your answers are scored by the SarkariPath backend.</Text>
        </View>
        <Text style={styles.practiceTag}>PRACTICE</Text>
      </View>

      {loading ? <LoadingState label="Loading questions from the backend…" /> : null}
      {!loading && error && questions.length === 0 ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!loading && !error && questions.length === 0 ? <EmptyState title="No quiz questions available" message="Please try again later." /> : null}
      {!loading && !result && questions.length > 0 ? (
        <>
          {questions.map((question, index) => (
            <Surface key={question.id} style={styles.questionCard}>
              <View style={styles.questionTitleRow}>
                <Text style={styles.questionNumber}>0{index + 1}</Text>
                <Text style={styles.questionText}>{question.prompt}</Text>
              </View>
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                return (
                  <Pressable
                    accessibilityLabel={option}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    key={`${question.id}-${optionIndex}`}
                    onPress={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                    style={[styles.option, selected && styles.optionSelected]}
                  >
                    <Text style={[styles.optionLetter, selected && styles.optionLetterSelected]}>{String.fromCharCode(65 + optionIndex)}</Text>
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
                    {selected ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </Surface>
          ))}
          {error ? <Text accessibilityRole="alert" style={styles.inlineError}>{error}</Text> : null}
          <View style={styles.submitRow}>
            <Text style={styles.answered}>{Object.keys(answers).length} of {questions.length} answered</Text>
            <View style={styles.submitButton}><SolidButton title={submitting ? "Checking…" : "See my results"} busy={submitting} disabled={!allAnswered} onPress={() => void submit()} /></View>
          </View>
        </>
      ) : null}
      {result ? (
        <Surface style={styles.resultCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.score}>{result.score}</Text>
            <Text style={styles.scoreTotal}>/{result.total}</Text>
          </View>
          <Text style={styles.resultEyebrow}>NICE WORK SHOWING UP</Text>
          <Text style={styles.resultTitle}>{result.correct} correct {result.correct === 1 ? "answer" : "answers"}</Text>
          <Text style={styles.resultCopy}>You got {result.incorrect} {result.incorrect === 1 ? "question" : "questions"} to revisit. Every attempt is progress.</Text>
          {result.review.map((item, index) => (
            <View key={item.id} style={styles.reviewCard}>
              <Text style={styles.reviewEyebrow}>QUESTION 0{index + 1}</Text>
              <Text style={styles.reviewQuestion}>{item.prompt}</Text>
              <Text style={styles.reviewAnswer}>Answer: {item.options[item.correctIndex]}</Text>
              {item.selectedIndex !== item.correctIndex ? <Text style={styles.yourAnswer}>Your answer: {item.selectedIndex === null ? "Not answered" : item.options[item.selectedIndex]}</Text> : null}
              <Text style={styles.reviewExplanation}>{item.explanation}</Text>
            </View>
          ))}
          <SolidButton title="Try again" onPress={() => { setAnswers({}); setResult(null); setError(""); }} />
        </Surface>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8 },
  subtitle: { marginTop: 7, marginBottom: 13, fontSize: 12 },
  quizMeta: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  metaIcon: { color: colors.gold, fontSize: 20 },
  metaCopy: { flex: 1 },
  metaTitle: { color: colors.ink, fontSize: 10, fontWeight: "700" },
  metaSubtitle: { marginTop: 4, color: colors.muted, fontSize: 9 },
  practiceTag: { paddingHorizontal: 7, paddingVertical: 5, borderRadius: 12, backgroundColor: "#F4F3E9", color: colors.gold, fontSize: 8, fontWeight: "700" },
  questionCard: { marginBottom: 11, padding: 13 },
  questionTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 9, marginBottom: 11 },
  questionNumber: { overflow: "hidden", width: 27, height: 27, borderRadius: 9, backgroundColor: colors.greenTint, color: colors.greenMid, fontSize: 9, fontWeight: "800", lineHeight: 27, textAlign: "center" },
  questionText: { flex: 1, paddingTop: 3, color: colors.ink, fontSize: 11, fontWeight: "700", lineHeight: 17 },
  option: { minHeight: 41, flexDirection: "row", alignItems: "center", gap: 9, marginTop: 7, paddingHorizontal: 9, borderRadius: 9, borderWidth: 1, borderColor: "#EBEEE9" },
  optionSelected: { borderColor: "#BDD3C1", backgroundColor: "#F1F6F0" },
  optionLetter: { width: 22, height: 22, overflow: "hidden", borderRadius: 7, borderWidth: 1, borderColor: colors.line, color: colors.muted, fontSize: 9, fontWeight: "700", lineHeight: 20, textAlign: "center" },
  optionLetterSelected: { borderColor: "#BED3C0", backgroundColor: "#E4EFE3", color: colors.green },
  optionText: { flex: 1, color: "#637168", fontSize: 10 },
  optionTextSelected: { color: colors.green, fontWeight: "600" },
  check: { color: colors.greenMid, fontSize: 15, fontWeight: "700" },
  inlineError: { marginBottom: 9, color: colors.red, fontSize: 10 },
  submitRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 2 },
  answered: { color: colors.muted, fontSize: 10 },
  submitButton: { minWidth: 150 },
  resultCard: { alignItems: "center", padding: 16 },
  scoreCircle: { width: 76, height: 76, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12, borderRadius: 40, borderWidth: 6, borderColor: "#E7F0E7" },
  score: { color: colors.greenMid, fontSize: 25, fontWeight: "800" },
  scoreTotal: { marginTop: 10, color: colors.muted, fontSize: 11 },
  resultEyebrow: { color: colors.greenMid, fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  resultTitle: { marginTop: 6, color: colors.ink, fontSize: 20, fontWeight: "800" },
  resultCopy: { marginTop: 6, marginBottom: 15, color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: "center" },
  reviewCard: { width: "100%", marginBottom: 9, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FCFDFB" },
  reviewEyebrow: { color: colors.greenMid, fontSize: 8, fontWeight: "700", letterSpacing: 0.8 },
  reviewQuestion: { marginTop: 6, color: colors.ink, fontSize: 10, fontWeight: "700", lineHeight: 15 },
  reviewAnswer: { marginTop: 7, color: colors.green, fontSize: 10, fontWeight: "700" },
  yourAnswer: { marginTop: 4, color: colors.red, fontSize: 9 },
  reviewExplanation: { marginTop: 5, color: colors.muted, fontSize: 9, lineHeight: 14 },
});
