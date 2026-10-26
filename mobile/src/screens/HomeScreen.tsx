import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getExams, getMaterials, type Exam, type StudyMaterial } from "../api";
import { DemoNotice, ErrorState, LoadingState, SectionTitle, SolidButton, Surface } from "../components";
import { colors, common } from "../theme";

type HomeData = { exams: Exam[]; materials: StudyMaterial[] };

export function HomeScreen({ onOpenQuiz, onOpenExams, onOpenStudy }: {
  onOpenQuiz: () => void;
  onOpenExams: () => void;
  onOpenStudy: () => void;
}) {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    setError("");
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [exams, materials] = await Promise.all([getExams(), getMaterials()]);
      setData({ exams, materials });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unexpected backend error.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <ScrollView
      contentContainerStyle={common.scroll}
      refreshControl={<RefreshControl colors={[colors.green]} refreshing={refreshing} onRefresh={() => void load(true)} />}
      showsVerticalScrollIndicator={false}
    >
      <Text style={common.eyebrow}>YOUR PREPARATION, ONE DAY AT A TIME</Text>
      <Text style={[common.heading, styles.title]}>A good day to make<Text style={styles.titleAccent}> progress.</Text></Text>
      <Text style={[common.body, styles.subtitle]}>A focused space for your next step.</Text>

      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>✦  YOUR DAILY MOMENTUM</Text>
        <Text style={styles.heroTitle}>Keep showing up.</Text>
        <Text style={styles.heroCopy}>You&apos;re closer than you think. A little practice is a good place to begin.</Text>
        <SolidButton title="Take today's quiz" onPress={onOpenQuiz} />
        <Text style={styles.heroFoot}>A short practice session · No timer</Text>
      </View>

      <DemoNotice />

      {loading && !data ? <LoadingState label="Connecting to your study space…" /> : null}
      {error && !data ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {data ? (
        <>
          <View style={styles.quickGrid}>
            <QuickStat label="Exam listings" value={`${data.exams.length}`} foot="sample entries" icon="▦" />
            <QuickStat label="Study resources" value={`${data.materials.length}`} foot="starter items" icon="▤" />
          </View>

          <SectionTitle eyebrow="STAY IN THE KNOW" title="Exam updates" action={<Text onPress={onOpenExams} style={styles.link}>See all  ›</Text>} />
          {data.exams.slice(0, 2).map((exam) => (
            <Surface key={exam.id} style={styles.examCard}>
              <View style={styles.examIcon}><Text style={styles.examIconText}>{exam.category.slice(0, 2)}</Text></View>
              <View style={styles.examCopy}>
                <Text numberOfLines={1} style={styles.examName}>{exam.name}</Text>
                <Text numberOfLines={1} style={styles.examOrg}>{exam.organization}</Text>
                <Text style={styles.examDate}>◷  {exam.dateLabel}</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>{exam.status}</Text></View>
            </Surface>
          ))}

          <Surface style={styles.quizCard}>
            <Text style={styles.quizTag}>DAILY PRACTICE</Text>
            <Text style={styles.quizTitle}>Three questions. A little more clarity.</Text>
            <Text style={styles.quizCopy}>Try a short Polity quiz and see how you do.</Text>
            <Text onPress={onOpenQuiz} style={styles.quizLink}>Start the quiz  ›</Text>
          </Surface>

          <SectionTitle eyebrow="A GOOD PLACE TO BEGIN" title="Study room" action={<Text onPress={onOpenStudy} style={styles.link}>Explore  ›</Text>} />
          {data.materials.slice(0, 2).map((item) => <ResourcePreview item={item} key={item.id} />)}
        </>
      ) : null}
    </ScrollView>
  );
}

function QuickStat({ label, value, foot, icon }: { label: string; value: string; foot: string; icon: string }) {
  return (
    <Surface style={styles.statCard}>
      <View style={styles.statIcon}><Text style={styles.statIconText}>{icon}</Text></View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}<Text style={styles.statFoot}>  {foot}</Text></Text>
    </Surface>
  );
}

export function ResourcePreview({ item }: { item: StudyMaterial }) {
  return (
    <Surface style={styles.resourceCard}>
      <View style={styles.resourceIcon}><Text style={styles.resourceIconText}>▤</Text></View>
      <View style={styles.resourceCopy}>
        <Text style={styles.resourceType}>{item.subject}  ·  {item.type}</Text>
        <Text numberOfLines={2} style={styles.resourceName}>{item.title}</Text>
        <Text style={styles.resourceDuration}>{item.duration}</Text>
      </View>
      {item.premium ? <Text style={styles.proTag}>PRO</Text> : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8, fontSize: 25, lineHeight: 32 },
  titleAccent: { color: "#759578" },
  subtitle: { marginTop: 6, marginBottom: 17, fontSize: 12 },
  hero: {
    marginBottom: 15,
    padding: 19,
    borderRadius: 18,
    backgroundColor: colors.green,
  },
  heroEyebrow: { marginBottom: 12, color: "#D0DFD2", fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  heroTitle: { color: colors.white, fontSize: 23, fontWeight: "800", letterSpacing: -0.5 },
  heroCopy: { marginTop: 7, marginBottom: 15, color: "#D0DED3", fontSize: 12, lineHeight: 18 },
  heroFoot: { marginTop: 10, color: "#C0D2C5", fontSize: 10 },
  quickGrid: { flexDirection: "row", gap: 10, marginBottom: 22 },
  statCard: { flex: 1, padding: 13 },
  statIcon: {
    width: 32,
    height: 32,
    marginBottom: 9,
    borderRadius: 10,
    backgroundColor: colors.greenTint,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconText: { color: colors.greenMid, fontSize: 17 },
  statLabel: { color: colors.muted, fontSize: 10 },
  statValue: { marginTop: 3, color: colors.ink, fontSize: 18, fontWeight: "800" },
  statFoot: { color: colors.faint, fontSize: 9, fontWeight: "400" },
  link: { color: colors.greenMid, fontSize: 11, fontWeight: "700" },
  examCard: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 9, padding: 12 },
  examIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F0F3E9",
    alignItems: "center",
    justifyContent: "center",
  },
  examIconText: { color: "#627A58", fontSize: 11, fontWeight: "800" },
  examCopy: { flex: 1 },
  examName: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  examOrg: { marginTop: 3, color: colors.muted, fontSize: 9 },
  examDate: { marginTop: 6, color: colors.muted, fontSize: 9 },
  statusBadge: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 5, borderRadius: 20, backgroundColor: colors.goldTint },
  statusText: { color: colors.gold, fontSize: 8, fontWeight: "700" },
  quizCard: { marginTop: 7, marginBottom: 22, padding: 16, backgroundColor: "#F6F4EA", borderColor: "#EEEADB" },
  quizTag: { color: colors.gold, fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  quizTitle: { marginTop: 8, color: colors.ink, fontSize: 16, fontWeight: "800", lineHeight: 22 },
  quizCopy: { marginTop: 5, color: colors.muted, fontSize: 11 },
  quizLink: { marginTop: 13, color: colors.green, fontSize: 11, fontWeight: "700" },
  resourceCard: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 9, padding: 12 },
  resourceIcon: { width: 37, height: 37, borderRadius: 11, backgroundColor: colors.lilac, alignItems: "center", justifyContent: "center" },
  resourceIconText: { color: "#776992", fontSize: 17 },
  resourceCopy: { flex: 1 },
  resourceType: { color: colors.muted, fontSize: 9 },
  resourceName: { marginTop: 4, color: colors.ink, fontSize: 11, fontWeight: "700" },
  resourceDuration: { marginTop: 4, color: colors.faint, fontSize: 9 },
  proTag: { overflow: "hidden", paddingHorizontal: 6, paddingVertical: 4, borderRadius: 5, backgroundColor: colors.goldTint, color: colors.gold, fontSize: 8, fontWeight: "800" },
});
