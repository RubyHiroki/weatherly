import React from 'react';
import { View, Text, ScrollView, useColorScheme, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles, lightColors, darkColors } from './WeeklyForecastScreen.styles';
import { geocode, fetchDaily, Daily } from '../services/weather';
import { weatherCodeToJa } from '../services/weatherCodes';
import WeatherIcon from './WeatherIcon';

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
  location?: string;
};

export default function WeeklyForecastScreen({ activeTab = 'weekly', onChangeTab, location = '東京、日本' }: Props) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const styles = createStyles();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [days, setDays] = React.useState<Daily[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const g = await geocode(location);
        const d = await fetchDaily(g.latitude, g.longitude);
        if (!mounted) return;
        setDays(d);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : '取得に失敗しました');
        setDays(null);
      } finally {
        mounted && setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [location]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Main list */}
      <ScrollView style={styles.main} contentContainerStyle={{ paddingTop: 50 }}>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        {loading && (
          <View style={{ padding: 16, alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        )}
        {error && !loading && (
          <View style={{ padding: 16 }}>
            <Text style={{ color: '#ef4444' }}>{error}</Text>
          </View>
        )}
        {!loading && !error && days && days.map((d, idx) => (
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
                    idx === 0 ? styles.dayBadgePrimaryBg : styles.dayBadgeNeutralBg,
                  ]}
                >
                  <Text style={idx === 0 ? styles.dayTextPrimary : styles.dayTextNeutral}>{idx === 0 ? '今日' : new Date(d.dateIso).toLocaleDateString('ja-JP', { weekday: 'short' })}</Text>
                  <Text style={idx === 0 ? styles.dateTextPrimary : styles.dateTextNeutral}>{new Date(d.dateIso).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}</Text>
                </View>
                <View style={{ marginRight: 12 }}>
                  <WeatherIcon code={d.weatherCode} size={28} />
                </View>
                <Text style={[styles.weatherLabel, { color: colors.textPrimary }]}>{weatherCodeToJa(d.weatherCode)}</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.temps}>
                  <Text style={[styles.tempHigh, { color: colors.textPrimary }]}>{Math.round(d.tMaxC)}°</Text>
                  <Text style={[styles.tempLow, { color: colors.textMuted }]}>{Math.round(d.tMinC)}°</Text>
                </View>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.divider, backgroundColor: colors.footerBg }]}>
        <View style={styles.nav}>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'current' ? 'location' : 'location-outline'} 
              size={24} 
              color={activeTab === 'current' ? colors.primary : colors.textMuted}
              onPress={() => onChangeTab && onChangeTab('current')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={[styles.navLabel, { color: activeTab === 'current' ? colors.primary : colors.textMuted }]}>現在地</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'weekly' ? 'calendar' : 'calendar-outline'} 
              size={24} 
              color={activeTab === 'weekly' ? colors.primary : colors.textMuted}
              onPress={() => onChangeTab && onChangeTab('weekly')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={[styles.navLabel, { color: activeTab === 'weekly' ? colors.primary : colors.textMuted }]}>週間予報</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'} 
              size={24} 
              color={activeTab === 'settings' ? colors.primary : colors.textMuted}
              onPress={() => onChangeTab && onChangeTab('settings')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={[styles.navLabel, { color: activeTab === 'settings' ? colors.primary : colors.textMuted }]}>設定</Text>
          </View>
        </View>
      </View>
    </View>
  );
}


