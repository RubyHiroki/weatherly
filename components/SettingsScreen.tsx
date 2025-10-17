import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { createStyles, lightColors, darkColors } from './WeatherScreen.styles';

type Props = {
  activeTab?: 'current' | 'weekly' | 'settings';
  onChangeTab?: (tab: 'current' | 'weekly' | 'settings') => void;
};

export default function SettingsScreen({ activeTab = 'settings', onChangeTab }: Props) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const styles = createStyles();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconSpacer} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>設定</Text>
          <View style={styles.headerIconButton}>
            <Text style={{ color: colors.textMuted, fontSize: 20 }}>≡</Text>
          </View>
        </View>
      </View>

      <View style={styles.main}>
        <Text style={[{ fontSize: 16 }, { color: colors.textPrimary }]}>設定画面（プレースホルダー）</Text>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.footerBg }]}>
        <View style={styles.nav}>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={[styles.navIcon, { color: activeTab === 'current' ? colors.primary : colors.textMuted }]}>📍</Text>
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={[styles.navLabel, { color: activeTab === 'current' ? colors.primary : colors.textMuted }]}>現在地</Text>
          </View>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={[styles.navIcon, { color: activeTab === 'weekly' ? colors.primary : colors.textMuted }]}>📆</Text>
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={[styles.navLabel, { color: activeTab === 'weekly' ? colors.primary : colors.textMuted }]}>週間予報</Text>
          </View>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={[styles.navIcon, { color: activeTab === 'settings' ? colors.primary : colors.textMuted }]}>⚙️</Text>
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={[styles.navLabel, { color: activeTab === 'settings' ? colors.primary : colors.textMuted }]}>設定</Text>
          </View>
        </View>
      </View>
    </View>
  );
}


