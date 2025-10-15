import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export const WeatherScreen: React.FC = () => {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconSpacer} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]} />
          <View style={styles.headerIconButton}>
            <Text style={{ color: colors.textMuted, fontSize: 20 }}>≡</Text>
          </View>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.centerBlock}>
          <Text style={[styles.city, { color: colors.textPrimary }]}>東京、日本</Text>
          <View style={styles.iconRow}>
            <Text style={styles.sunIcon}>☀️</Text>
            <Text style={[styles.temp, { color: colors.textPrimary }]}>24°</Text>
          </View>
        </View>

        <Text style={[styles.desc, { color: colors.textPrimary }]}>晴れ</Text>
        <View style={styles.details}>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>降水確率 0%</Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>最高: 28° / 最低: 20°</Text>
        </View>
      </View>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.footerBg,
          },
        ]}
      >
        <View style={styles.nav}>
          <View style={styles.navItemActive}>
            <Text style={[styles.navIcon, { color: colors.primary }]}>📍</Text>
            <Text style={[styles.navLabel, { color: colors.primary }]}>現在地</Text>
          </View>
          <View style={styles.navItem}>
            <Text style={[styles.navIcon, { color: colors.textMuted }]}>📅</Text>
            <Text style={[styles.navLabel, { color: colors.textMuted }]}>週間予報</Text>
          </View>
          <View style={styles.navItem}>
            <Text style={[styles.navIcon, { color: colors.textMuted }]}>⚙️</Text>
            <Text style={[styles.navLabel, { color: colors.textMuted }]}>設定</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const lightColors = {
  primary: '#197fe6',
  background: '#f6f7f8',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#475569',
  border: 'rgba(226, 232, 240, 0.5)',
  footerBg: 'rgba(246, 247, 248, 0.8)',
};

const darkColors = {
  primary: '#197fe6',
  background: '#111921',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#cbd5e1',
  border: 'rgba(71, 85, 105, 0.5)',
  footerBg: 'rgba(17, 25, 33, 0.8)',
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconSpacer: {
    width: 48,
    height: 48,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerIconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centerBlock: {
    alignItems: 'center',
  },
  city: {
    fontSize: 22,
    fontWeight: '700',
  },
  iconRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16 as unknown as number,
  },
  sunIcon: {
    fontSize: 56,
  },
  temp: {
    fontSize: 72,
    fontWeight: '800',
  },
  desc: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  details: {
    marginTop: 12,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  navIcon: {
    fontSize: 18,
  },
  navLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default WeatherScreen;


