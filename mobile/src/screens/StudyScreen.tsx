import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { getMaterials, type StudyMaterial } from "../api";
import { DemoNotice, EmptyState, ErrorState, LoadingState, SectionTitle } from "../components";
import { ResourcePreview } from "./HomeScreen";
import { colors, common } from "../theme";

export function StudyScreen() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    setError("");
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      setMaterials(await getMaterials());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unexpected backend error.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function toggleBookmark(id: string) {
    setBookmarks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <ScrollView
      contentContainerStyle={common.scroll}
      refreshControl={<RefreshControl colors={[colors.green]} refreshing={refreshing} onRefresh={() => void load(true)} />}
      showsVerticalScrollIndicator={false}
    >
      <Text style={common.eyebrow}>YOUR STUDY ROOM</Text>
      <Text style={[common.heading, styles.title]}>Learn at your own pace.</Text>
      <Text style={[common.body, styles.subtitle]}>Notes and focused practice for your next study session.</Text>
      <DemoNotice compact />
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>✦</Text>
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>Small steps add up.</Text>
          <Text style={styles.tipBody}>Choose one topic to focus on today. You can always pick another tomorrow.</Text>
        </View>
      </View>
      <SectionTitle eyebrow="EXPLORE THE LIBRARY" title="Study resources" />
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={() => void load()} /> : materials.length === 0 ? (
        <EmptyState title="No resources available" message="Please try again later." />
      ) : materials.map((item) => (
        <View key={item.id}>
          <ResourcePreview item={item} />
          <Text style={styles.description}>{item.detail}</Text>
          {item.content ? (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${expandedId === item.id ? "Close" : "Read"} resource: ${item.title}`}
                accessibilityState={{ expanded: expandedId === item.id }}
                onPress={() => setExpandedId((current) => current === item.id ? null : item.id)}
                style={styles.readButton}
              >
                <Text style={styles.readLabel}>{expandedId === item.id ? "Close resource" : "Read resource"}</Text>
              </Pressable>
              {expandedId === item.id ? (
                <View style={styles.reader}>
                  <Text style={styles.readerNotice}>Sample learning content. PRO is a demo label, not a payment restriction.</Text>
                  {item.content.split("\n\n").map((section, index) => (
                    <Text key={index} style={styles.readerText}>{section}</Text>
                  ))}
                </View>
              ) : null}
            </>
          ) : (
            <Text style={styles.description}>Content has not been added to this resource yet.</Text>
          )}
          {!item.premium ? (
            <Text accessibilityRole="button" onPress={() => toggleBookmark(item.id)} style={[styles.bookmark, bookmarks.includes(item.id) && styles.bookmarked]}>
              {bookmarks.includes(item.id) ? "★  Saved for this session" : "☆  Save for this session"}
            </Text>
          ) : null}
        </View>
      ))}
      <View style={styles.offline}>
        <Text style={styles.offlineIcon}>↓</Text>
        <View style={styles.offlineCopy}>
          <Text style={styles.offlineTitle}>Offline downloads are not available yet</Text>
          <Text style={styles.offlineBody}>Read the demo content above while connected. Downloadable files are not available.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8, fontSize: 24 },
  subtitle: { marginTop: 6, marginBottom: 14 },
  description: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 8 },
  readButton: { alignSelf: "flex-start", padding: 12, marginBottom: 12, borderRadius: 8, backgroundColor: colors.greenTint },
  readLabel: { color: colors.green, fontSize: 12, fontWeight: "700" },
  reader: { padding: 14, marginBottom: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  readerNotice: { color: colors.muted, fontSize: 11, lineHeight: 17, marginBottom: 14 },
  readerText: { color: colors.ink, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  tip: { flexDirection: "row", gap: 10, marginBottom: 22, padding: 14, borderRadius: 13, backgroundColor: "#F0F4EC" },
  tipIcon: { color: "#71815A", fontSize: 19 },
  tipCopy: { flex: 1 },
  tipTitle: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  tipBody: { marginTop: 4, color: colors.muted, fontSize: 10, lineHeight: 15 },
  bookmark: { alignSelf: "flex-end", marginTop: -6, marginBottom: 12, color: colors.greenMid, fontSize: 10, fontWeight: "600" },
  bookmarked: { color: colors.gold },
  offline: { flexDirection: "row", gap: 10, marginTop: 9, padding: 13, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  offlineIcon: { color: colors.greenMid, fontSize: 17 },
  offlineCopy: { flex: 1 },
  offlineTitle: { color: colors.ink, fontSize: 10, fontWeight: "700" },
  offlineBody: { marginTop: 4, color: colors.muted, fontSize: 9, lineHeight: 14 },
});
