import { useCallback, useEffect, useMemo, useState } from "react";
import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { getExams, type Exam } from "../api";
import { DemoNotice, EmptyState, ErrorState, LoadingState, Surface } from "../components";
import { colors, common } from "../theme";

export function ExamsScreen() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    setError("");
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      setExams(await getExams());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unexpected backend error.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const categories = useMemo(() => ["All", ...new Set(exams.map((exam) => exam.category))], [exams]);
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return exams.filter((exam) => {
      const searchable = `${exam.name} ${exam.organization} ${exam.category}`.toLowerCase();
      return (!text || searchable.includes(text)) && (category === "All" || category === exam.category);
    });
  }, [category, exams, query]);

  return (
    <ScrollView
      contentContainerStyle={common.scroll}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl colors={[colors.green]} refreshing={refreshing} onRefresh={() => void load(true)} />}
      showsVerticalScrollIndicator={false}
    >
      <Text style={common.eyebrow}>PLAN WITH CLARITY</Text>
      <Text style={[common.heading, styles.title]}>Exams &amp; opportunities</Text>
      <Text style={[common.body, styles.intro]}>Keep the opportunities on your radar. Confirm dates and eligibility with the official notice.</Text>
      <DemoNotice compact />
      <View style={styles.search}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search exams or organizations"
          onChangeText={setQuery}
          placeholder="Search exams or organizations"
          placeholderTextColor={colors.faint}
          returnKeyType="search"
          style={styles.searchInput}
          value={query}
        />
        {query.length > 0 ? <Text accessibilityRole="button" onPress={() => setQuery("")} style={styles.clear}>×</Text> : null}
      </View>
      {!loading && !error && exams.length > 0 ? (
        <ScrollView horizontal contentContainerStyle={styles.chips} showsHorizontalScrollIndicator={false}>
          {categories.map((item) => (
            <Pressable accessibilityRole="button" accessibilityState={{ selected: category === item }} key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}>
              <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={() => void load()} /> : (
        <>
          <Text style={styles.resultCount}>{filtered.length} {filtered.length === 1 ? "listing" : "listings"}</Text>
          {filtered.length === 0 ? <EmptyState title="No exams found" message="Try another search or choose a different category." /> : filtered.map((exam) => <ExamCard exam={exam} key={exam.id} />)}
        </>
      )}
      <Text style={styles.disclaimer}>Dates and statuses are sample content and have not been verified.</Text>
    </ScrollView>
  );
}

function ExamCard({ exam }: { exam: Exam }) {
  const [linkError, setLinkError] = useState("");
  async function openSource() {
    try {
      await Linking.openURL(exam.sourceUrl);
      setLinkError("");
    } catch {
      setLinkError("Couldn't open the official website on this device.");
    }
  }

  return (
    <Surface style={styles.examCard}>
      <View style={styles.cardTop}>
        <View style={styles.examBadge}><Text style={styles.examBadgeText}>{exam.category.slice(0, 2)}</Text></View>
        <Text style={styles.status}>{exam.status}</Text>
      </View>
      <Text style={styles.category}>{exam.category}  ·  {exam.organization}</Text>
      <Text style={styles.name}>{exam.name}</Text>
      <View style={styles.dateBox}>
        <Text style={styles.dateIcon}>▦</Text>
        <View style={styles.dateCopy}>
          <Text style={styles.dateLabel}>{exam.dateLabel}</Text>
          <Text style={styles.dateDetail}>{exam.dateDetail}</Text>
        </View>
      </View>
      <View style={styles.sourceRow}><Text style={styles.shield}>◇</Text><Text style={styles.source}>{exam.sourceLabel}</Text><Text style={styles.unverified}>Unverified</Text></View>
      <Pressable accessibilityRole="link" onPress={() => void openSource()} style={styles.sourceButton}>
        <Text style={styles.sourceLink}>Visit official source  ↗</Text>
      </Pressable>
      {linkError ? <Text style={styles.linkError}>{linkError}</Text> : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8 },
  intro: { marginTop: 7, marginBottom: 14, fontSize: 12 },
  search: { flexDirection: "row", alignItems: "center", height: 46, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  searchIcon: { marginRight: 8, color: colors.muted, fontSize: 22 },
  searchInput: { flex: 1, height: 46, color: colors.ink, fontSize: 12 },
  clear: { paddingHorizontal: 6, color: colors.muted, fontSize: 21 },
  chips: { gap: 8, paddingVertical: 12 },
  chip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 22, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  chipActive: { borderColor: "#D2E1D4", backgroundColor: colors.greenTint },
  chipText: { color: colors.muted, fontSize: 10 },
  chipTextActive: { color: colors.green, fontWeight: "700" },
  resultCount: { marginTop: 4, marginBottom: 10, color: colors.muted, fontSize: 10 },
  examCard: { marginBottom: 11, padding: 15 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  examBadge: { width: 39, height: 39, borderRadius: 12, backgroundColor: colors.greenTint, alignItems: "center", justifyContent: "center" },
  examBadgeText: { color: colors.greenMid, fontSize: 11, fontWeight: "800" },
  status: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 18, backgroundColor: colors.goldTint, color: colors.gold, fontSize: 9, fontWeight: "700" },
  category: { marginTop: 11, color: colors.muted, fontSize: 9 },
  name: { marginTop: 5, color: colors.ink, fontSize: 15, fontWeight: "700" },
  dateBox: { flexDirection: "row", alignItems: "flex-start", gap: 9, marginTop: 13, padding: 11, borderRadius: 10, backgroundColor: "#F7F8F4" },
  dateIcon: { color: colors.greenMid, fontSize: 16 },
  dateCopy: { flex: 1 },
  dateLabel: { color: colors.ink, fontSize: 10, fontWeight: "700" },
  dateDetail: { marginTop: 4, color: colors.muted, fontSize: 9, lineHeight: 14 },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 12 },
  shield: { color: colors.greenMid, fontSize: 14 },
  source: { flex: 1, color: colors.muted, fontSize: 9 },
  unverified: { color: colors.gold, fontSize: 8 },
  sourceButton: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  sourceLink: { color: colors.greenMid, fontSize: 10, fontWeight: "700" },
  linkError: { marginTop: 8, color: colors.red, fontSize: 10 },
  disclaimer: { marginTop: 5, marginBottom: 10, color: colors.faint, fontSize: 9, textAlign: "center" },
});
