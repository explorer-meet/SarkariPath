import type { PropsWithChildren, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_ORIGIN } from "./api";
import { colors, common } from "./theme";

export function BrandHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>s.</Text></View>
        <Text style={styles.brandName}>Sarkari<Text style={styles.brandLight}>Path</Text></Text>
      </View>
      <View style={styles.connectionBadge}>
        <View style={styles.connectionDot} />
        <Text style={styles.connectionText}>Demo backend</Text>
      </View>
    </View>
  );
}

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.notice, compact && styles.noticeCompact]}>
      <Text style={styles.noticeIcon}>ⓘ</Text>
      <Text style={styles.noticeText}>
        Demo content. Confirm exam details with the official source.
      </Text>
    </View>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.sectionTitleCopy}>
        {eyebrow ? <Text style={common.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionHeading}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function SolidButton({
  title,
  onPress,
  disabled = false,
  busy = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        common.button,
        (disabled || busy) && styles.buttonDisabled,
        pressed && !disabled && !busy && styles.buttonPressed,
      ]}
    >
      {busy ? <ActivityIndicator color={colors.white} /> : <Text style={common.buttonText}>{title}  ›</Text>}
    </Pressable>
  );
}

export function LoadingState({ label = "Loading from SarkariPath…" }: { label?: string }) {
  return (
    <View style={styles.stateBox}>
      <ActivityIndicator color={colors.green} />
      <Text style={styles.stateLabel}>{label}</Text>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorIcon}>!</Text>
      <Text style={styles.errorTitle}>Could not load this right now</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      <Text style={styles.errorHost}>Backend: {API_ORIGIN}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryText}>Try again</Text>
      </Pressable>
    </View>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyIcon}>⌕</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

export function Surface({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[common.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
  },
  brandMarkText: { color: colors.white, fontSize: 20, fontWeight: "800" },
  brandName: { color: colors.ink, fontSize: 18, fontWeight: "800", letterSpacing: -0.65 },
  brandLight: { color: colors.greenMid, fontWeight: "500" },
  connectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 30,
  },
  connectionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#75A27D" },
  connectionText: { color: colors.muted, fontSize: 10, fontWeight: "600" },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginBottom: 16,
    padding: 12,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E8EBDD",
    backgroundColor: "#FCFDF9",
  },
  noticeCompact: { marginBottom: 12, padding: 10 },
  noticeIcon: { color: colors.greenMid, fontSize: 15 },
  noticeText: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 16 },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitleCopy: { flex: 1, gap: 4 },
  sectionHeading: { color: colors.ink, fontSize: 17, fontWeight: "700" },
  stateBox: { minHeight: 150, alignItems: "center", justifyContent: "center", gap: 12 },
  stateLabel: { color: colors.muted, fontSize: 12 },
  errorBox: {
    alignItems: "center",
    marginTop: 18,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0DEDB",
    backgroundColor: colors.white,
  },
  errorIcon: {
    width: 32,
    height: 32,
    marginBottom: 9,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: colors.redTint,
    color: colors.red,
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 32,
    textAlign: "center",
  },
  errorTitle: { color: colors.ink, fontSize: 14, fontWeight: "700", textAlign: "center" },
  errorMessage: { marginTop: 7, color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: "center" },
  errorHost: { marginTop: 8, color: colors.faint, fontSize: 10 },
  retryButton: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: colors.greenTint,
  },
  retryText: { color: colors.green, fontSize: 11, fontWeight: "700" },
  emptyBox: {
    alignItems: "center",
    padding: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  emptyIcon: { color: "#829687", fontSize: 27 },
  emptyTitle: { marginTop: 8, color: colors.ink, fontSize: 13, fontWeight: "700" },
  emptyMessage: { marginTop: 5, color: colors.muted, fontSize: 11, textAlign: "center" },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.85 },
});
