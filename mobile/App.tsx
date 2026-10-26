import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BrandHeader } from "./src/components";
import { ExamsScreen } from "./src/screens/ExamsScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { QuizScreen } from "./src/screens/QuizScreen";
import { StudyScreen } from "./src/screens/StudyScreen";
import { colors } from "./src/theme";

type Tab = "home" | "exams" | "study" | "quiz";

const tabs: { id: Tab; label: string; glyph: string }[] = [
  { id: "home", label: "Home", glyph: "⌂" },
  { id: "exams", label: "Exams", glyph: "▦" },
  { id: "study", label: "Study", glyph: "▤" },
  { id: "quiz", label: "Daily quiz", glyph: "✧" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.app}>
          <BrandHeader />
          <View style={styles.content} key={tab}>
            {tab === "home" ? (
              <HomeScreen
                onOpenExams={() => setTab("exams")}
                onOpenQuiz={() => setTab("quiz")}
                onOpenStudy={() => setTab("study")}
              />
            ) : tab === "exams" ? (
              <ExamsScreen />
            ) : tab === "study" ? (
              <StudyScreen />
            ) : (
              <QuizScreen />
            )}
          </View>
          <View accessibilityRole="tablist" style={styles.tabBar}>
            {tabs.map((item) => {
              const selected = tab === item.id;
              return (
                <Pressable
                  accessibilityLabel={item.label}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  key={item.id}
                  onPress={() => setTab(item.id)}
                  style={styles.tabTouchable}
                >
                  <View style={[styles.tabItem, selected && styles.tabItemActive]}>
                    <Text style={[styles.tabGlyph, selected && styles.tabGlyphActive]}>{item.glyph}</Text>
                    <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{item.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  app: { flex: 1, backgroundColor: colors.canvas },
  content: { flex: 1 },
  tabBar: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-around",
    paddingTop: 6,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
  },
  tabTouchable: { flex: 1 },
  tabItem: {
    minHeight: 49,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: 10,
  },
  tabItemActive: { backgroundColor: "#F0F5F0" },
  tabGlyph: { color: "#89958C", fontSize: 20, lineHeight: 24 },
  tabGlyphActive: { color: colors.green, fontWeight: "700" },
  tabLabel: { color: "#89958C", fontSize: 9, fontWeight: "600" },
  tabLabelActive: { color: colors.green, fontWeight: "700" },
});
