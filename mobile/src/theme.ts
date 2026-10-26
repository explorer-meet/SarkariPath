import { StyleSheet } from "react-native";

export const colors = {
  green: "#164B3B",
  greenDark: "#123D31",
  greenMid: "#537A61",
  greenTint: "#EAF2EB",
  canvas: "#F7F8F4",
  white: "#FFFFFF",
  ink: "#23352D",
  muted: "#7E8B82",
  faint: "#9BA59E",
  line: "#E7ECE5",
  gold: "#937943",
  goldTint: "#F7F2E5",
  red: "#A44942",
  redTint: "#FBEEEC",
  lilac: "#F1EDF7",
};

export const common = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  eyebrow: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1.15 },
  heading: { color: colors.ink, fontSize: 26, fontWeight: "800", letterSpacing: -0.8 },
  body: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
  },
  button: {
    minHeight: 46,
    paddingHorizontal: 17,
    borderRadius: 12,
    backgroundColor: colors.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: { color: colors.white, fontSize: 13, fontWeight: "700" },
});
