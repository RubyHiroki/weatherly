import React from 'react';
import { View, Text, useColorScheme, ActivityIndicator } from 'react-native';
import { createStyles, lightColors, darkColors } from './WeatherScreen.styles';
import { geocode, fetchCurrent, fetchTodayForecast, fetchDaily } from '../services/weather';
import { weatherCodeToJa } from '../services/weatherCodes';
import WeatherIcon from './WeatherIcon';

type Props = {
  activeTab?: 'current' | 'weekly' | 'settings';
  onChangeTab?: (tab: 'current' | 'weekly' | 'settings') => void;
  location?: string;
};

export const WeatherScreen: React.FC<Props> = ({ activeTab = 'current', onChangeTab, location = '東京、日本' }) => {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const styles = createStyles();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tempC, setTempC] = React.useState<number | null>(null);
  const [wCode, setWCode] = React.useState<number | null>(null);
  const [tMaxC, setTMaxC] = React.useState<number | null>(null);
  const [tMinC, setTMinC] = React.useState<number | null>(null);
  const [precipitationProbability, setPrecipitationProbability] = React.useState<number | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const g = await geocode(location);
        const [cur, todayForecast, dailyData] = await Promise.all([
          fetchCurrent(g.latitude, g.longitude),
          fetchTodayForecast(g.latitude, g.longitude),
          fetchDaily(g.latitude, g.longitude)
        ]);
        if (!mounted) return;
        setTempC(cur.temperatureC);
        // 週間予報と同じデータソース（今日の予報）を使用
        setWCode(dailyData[0]?.weatherCode ?? cur.weatherCode);
        setTMaxC(todayForecast.tMaxC);
        setTMinC(todayForecast.tMinC);
        setPrecipitationProbability(todayForecast.precipitationProbability);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : '取得に失敗しました');
        setTempC(null);
        setWCode(null);
        setTMaxC(null);
        setTMinC(null);
        setPrecipitationProbability(null);
      } finally {
        mounted && setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [location]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconSpacer} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]} />
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.centerBlock}>
          <Text style={[styles.city, { color: colors.textPrimary }]}>{location}</Text>
          {loading ? (
            <View style={{ marginTop: 16 }}>
              <ActivityIndicator />
            </View>
          ) : error ? (
            <Text style={{ color: '#ef4444', marginTop: 16 }}>{error}</Text>
          ) : (
            <View style={styles.iconRow}>
              <WeatherIcon code={wCode} />
              <Text style={[styles.temp, { color: colors.textPrimary }]}>
                {tempC !== null ? `${Math.round(tempC)}°` : '--'}
              </Text>
            </View>
          )}
        </View>

        {!loading && !error && (
          <View>
            <Text style={[styles.desc, { color: colors.textPrimary }]}>{weatherCodeToJa(wCode)}</Text>
            <View style={styles.details}>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                最高: {tMaxC !== null ? `${Math.round(tMaxC)}°` : '--'} / 最低: {tMinC !== null ? `${Math.round(tMinC)}°` : '--'}
              </Text>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                降水確率: {precipitationProbability !== null ? `${Math.round(precipitationProbability)}%` : '--'}
              </Text>
            </View>
          </View>
        )}
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
};

export default WeatherScreen;
