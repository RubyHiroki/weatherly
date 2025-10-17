import React from 'react';
import { View, Text, ScrollView, useColorScheme } from 'react-native';
import { createStyles, lightColors, darkColors } from './WeeklyForecastScreen.styles';

type DayItem = {
  label: string; // 今日/火/水...
  date: string;  // 5/20 など
  icon: string;  // 絵文字で代替
  labelText: string; // 晴れ、曇り、雨...
  high: string; // 25°
  low: string;  // 15°
  highlight?: boolean; // 今日のみ強調
};

const SAMPLE: DayItem[] = [
  { label: '今日', date: '5/20', icon: '☀️', labelText: '晴れ', high: '25°', low: '15°', highlight: true },
  { label: '火', date: '5/21', icon: '☁️', labelText: '曇り', high: '22°', low: '14°' },
  { label: '水', date: '5/22', icon: '🌧️', labelText: '雨', high: '20°', low: '16°' },
  { label: '木', date: '5/23', icon: '☁️', labelText: '曇り', high: '23°', low: '17°' },
  { label: '金', date: '5/24', icon: '☀️', labelText: '晴れ時々曇り', high: '26°', low: '18°' },
  { label: '土', date: '5/25', icon: '☀️', labelText: '晴れ', high: '28°', low: '19°' },
  { label: '日', date: '5/26', icon: '🌧️', labelText: '雨', high: '21°', low: '16°' },
];

type Props = {
  activeTab?: 'current' | 'weekly' | 'settings';
  onChangeTab?: (tab: 'current' | 'weekly' | 'settings') => void;
};

export default function WeeklyForecastScreen({ activeTab = 'weekly', onChangeTab }: Props) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const styles = createStyles();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}> 
        <View style={styles.headerRow}>
          <Text style={[{ color: colors.textMuted }, styles.chevron]}>{'‹'}</Text>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>週間予報</Text>
        </View>
      </View>

      {/* Main list */}
      <ScrollView style={styles.main}>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        {SAMPLE.map((d, idx) => (
          <View key={idx}>
            <View
              style={[
                styles.row,
                { backgroundColor: 'transparent' },
              ]}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.dayBadge,
                    d.highlight ? styles.dayBadgePrimaryBg : styles.dayBadgeNeutralBg,
                  ]}
                >
                  <Text style={d.highlight ? styles.dayTextPrimary : styles.dayTextNeutral}>{d.label}</Text>
                  <Text style={d.highlight ? styles.dateTextPrimary : styles.dateTextNeutral}>{d.date}</Text>
                </View>
                <Text style={[styles.icon, { color: d.icon === '☀️' ? '#f59e0b' : d.icon === '🌧️' ? '#22d3ee' : colors.textMuted }]}>
                  {d.icon}
                </Text>
                <Text style={[styles.weatherLabel, { color: colors.textPrimary }]}>{d.labelText}</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.temps}>
                  <Text style={[styles.tempHigh, { color: colors.textPrimary }]}>{d.high}</Text>
                  <Text style={[styles.tempLow, { color: colors.textMuted }]}>{d.low}</Text>
                </View>
                <Text style={[styles.chevron, { color: colors.textMuted }]}>{'›'}</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.divider, backgroundColor: colors.footerBg }]}>
        <View style={styles.footerNav}>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={{ color: activeTab === 'current' ? colors.primary : colors.textMuted }}>📍</Text>
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={[styles.navLabel, { color: activeTab === 'current' ? colors.primary : colors.textMuted }]}>現在地</Text>
          </View>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={{ color: activeTab === 'weekly' ? colors.primary : colors.textMuted }}>📆</Text>
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={[styles.navLabel, { color: activeTab === 'weekly' ? colors.primary : colors.textMuted }]}>週間予報</Text>
          </View>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={{ color: activeTab === 'settings' ? colors.primary : colors.textMuted }}>⚙️</Text>
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={[styles.navLabel, { color: activeTab === 'settings' ? colors.primary : colors.textMuted }]}>設定</Text>
          </View>
        </View>
      </View>
    </View>
  );
}


