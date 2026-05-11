import {
  Badge,
  Button,
  Divider,
  MarwesNativeProvider,
  useMarwesTheme,
} from "@marwes-ui/react-native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"

function ComponentDemo() {
  const { mode, toggleMode, theme } = useMarwesTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.color.background }]}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.color.text }]}>Marwes React Native POC</Text>
        <Text style={[styles.subtitle, { color: theme.color.textMuted }]}>
          Mode: {mode} • Compiled CSS → RN styles
        </Text>

        {/* Mode toggle */}
        <View style={styles.section}>
          <Button variant="secondary" onPress={toggleMode}>
            Toggle {mode === "light" ? "Dark" : "Light"} Mode
          </Button>
        </View>

        <Divider size="sm" />

        {/* ── Button Variants ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.color.text }]}>Button — Variants</Text>
          <View style={styles.row}>
            <Button variant="primary">Primary</Button>
          </View>
          <View style={styles.row}>
            <Button variant="secondary">Secondary</Button>
          </View>
          <View style={styles.row}>
            <Button variant="neutral">Neutral</Button>
          </View>
          <View style={styles.row}>
            <Button variant="text">Text</Button>
          </View>
          <View style={styles.row}>
            <Button variant="success">Success</Button>
          </View>
        </View>

        {/* ── Button Sizes ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.color.text }]}>Button — Sizes</Text>
          <View style={styles.row}>
            <Button variant="primary" size="xs">
              XS
            </Button>
            <Button variant="primary" size="sm">
              SM
            </Button>
            <Button variant="primary" size="md">
              MD
            </Button>
            <Button variant="primary" size="lg">
              LG
            </Button>
          </View>
        </View>

        {/* ── Button States ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.color.text }]}>Button — States</Text>
          <View style={styles.row}>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </View>
          <View style={styles.row}>
            <Button variant="primary" error>
              Error
            </Button>
          </View>
          <View style={styles.row}>
            <Button variant="secondary" error>
              Error Secondary
            </Button>
          </View>
        </View>

        <Divider size="md" />

        {/* ── Badge Variants ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.color.text }]}>Badge — Variants</Text>
          <View style={styles.badgeRow}>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </View>
        </View>

        <Divider size="md" />

        {/* ── Divider ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.color.text }]}>Divider — Sizes</Text>
          <Text style={[styles.label, { color: theme.color.textMuted }]}>xxs</Text>
          <Divider size="xxs" />
          <Text style={[styles.label, { color: theme.color.textMuted }]}>xs</Text>
          <Divider size="xs" />
          <Text style={[styles.label, { color: theme.color.textMuted }]}>sm</Text>
          <Divider size="sm" />
          <Text style={[styles.label, { color: theme.color.textMuted }]}>md</Text>
          <Divider size="md" />
          <Text style={[styles.label, { color: theme.color.textMuted }]}>lg</Text>
          <Divider size="lg" />
        </View>

        <Divider size="md" />

        {/* ── Divider Vertical ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.color.text }]}>Divider — Vertical</Text>
          <View style={styles.verticalDividerRow}>
            <Text style={{ color: theme.color.text }}>Left</Text>
            <Divider orientation="vertical" size="sm" />
            <Text style={{ color: theme.color.text }}>Center</Text>
            <Divider orientation="vertical" size="sm" />
            <Text style={{ color: theme.color.text }}>Right</Text>
          </View>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <MarwesNativeProvider>
      <ComponentDemo />
    </MarwesNativeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: -16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  verticalDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 40,
  },
})
