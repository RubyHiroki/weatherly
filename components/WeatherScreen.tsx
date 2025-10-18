import React from 'react';
import { View, Text, useColorScheme, ActivityIndicator } from 'react-native';
import { createStyles, lightColors, darkColors } from './WeatherScreen.styles';
import { geocode, fetchCurrent, fetchTodayForecast, fetchDaily } from '../services/weather';
import { weatherCodeToJa } from '../services/weatherCodes';
import WeatherIcon from './WeatherIcon';

// 背景色に応じた文字色を取得する関数
function getTextColorForBackground(backgroundColor: string): string {
  // 背景色の明度を計算（簡易版）
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 明度が128より低い場合は白文字、高い場合は黒文字
  return brightness < 128 ? '#ffffff' : '#000000';
}

// 時間帯と天気に基づく背景色を取得する関数
function getWeatherBackgroundColor(weatherCode: number | null, isDark: boolean): string {
  const hour = new Date().getHours();
  
  // 時間帯の判定
  const isNight = hour >= 18 || hour <= 6; // 18時〜6時を夜とする
  const isDawn = hour >= 5 && hour <= 7; // 5時〜7時を夜明けとする
  const isDusk = hour >= 17 && hour <= 19; // 17時〜19時を夕暮れとする
  
  if (isDark) {
    // ダークモード用の柔らかい背景色
    if (weatherCode === 0 || weatherCode === 1) {
      // 晴れ
      if (isNight) return '#1a202c'; // 柔らかい深い青
      if (isDawn || isDusk) return '#2d3748'; // 柔らかい夕暮れ/夜明けの青
      return '#2b6cb0'; // 柔らかい昼間の青
    } else if (weatherCode === 2) {
      // 薄曇り
      if (isNight) return '#2d3748'; // 柔らかい深いグレー
      if (isDawn || isDusk) return '#4a5568'; // 柔らかい夕暮れ/夜明けのグレー
      return '#718096'; // 柔らかい昼間のグレー
    } else if (weatherCode === 3) {
      // 曇り
      if (isNight) return '#1a202c'; // 柔らかい非常に深いグレー
      if (isDawn || isDusk) return '#2d3748'; // 柔らかい夕暮れ/夜明けのグレー
      return '#4a5568'; // 柔らかい昼間のグレー
    } else if (weatherCode !== null && ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82))) {
      // 雨
      if (isNight) return '#2c5282'; // 柔らかい深い青
      if (isDawn || isDusk) return '#2b6cb0'; // 柔らかい夕暮れ/夜明けの青
      return '#3182ce'; // 柔らかい昼間の青
    } else if (weatherCode !== null && ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86))) {
      // 雪
      if (isNight) return '#2d3748'; // 柔らかい深い青
      if (isDawn || isDusk) return '#4a5568'; // 柔らかい夕暮れ/夜明けの青
      return '#718096'; // 柔らかい昼間の青
    } else if (weatherCode !== null && (weatherCode >= 95 && weatherCode <= 99)) {
      // 雷
      if (isNight) return '#553c9a'; // 柔らかい深い紫
      if (isDawn || isDusk) return '#805ad5'; // 柔らかい夕暮れ/夜明けの紫
      return '#9f7aea'; // 柔らかい昼間の紫
    }
    return '#1a202c'; // 柔らかいデフォルト
  } else {
    // ライトモード用の柔らかい背景色
    if (weatherCode === 0 || weatherCode === 1) {
      // 晴れ
      if (isNight) return '#2c5282'; // 柔らかい深い青
      if (isDawn || isDusk) return '#3182ce'; // 柔らかい夕暮れ/夜明けの青
      return '#90cdf4'; // 柔らかい昼間の青
    } else if (weatherCode === 2) {
      // 薄曇り
      if (isNight) return '#4a5568'; // 柔らかい深いグレー
      if (isDawn || isDusk) return '#718096'; // 柔らかい夕暮れ/夜明けのグレー
      return '#cbd5e0'; // 柔らかい昼間のグレー
    } else if (weatherCode === 3) {
      // 曇り
      if (isNight) return '#2d3748'; // 柔らかい非常に深いグレー
      if (isDawn || isDusk) return '#4a5568'; // 柔らかい夕暮れ/夜明けのグレー
      return '#a0aec0'; // 柔らかい昼間のグレー
    } else if (weatherCode !== null && ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82))) {
      // 雨
      if (isNight) return '#2b6cb0'; // 柔らかい深い青
      if (isDawn || isDusk) return '#3182ce'; // 柔らかい夕暮れ/夜明けの青
      return '#63b3ed'; // 柔らかい昼間の青
    } else if (weatherCode !== null && ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86))) {
      // 雪
      if (isNight) return '#4a5568'; // 柔らかい深い青
      if (isDawn || isDusk) return '#718096'; // 柔らかい夕暮れ/夜明けの青
      return '#a0aec0'; // 柔らかい昼間の青
    } else if (weatherCode !== null && (weatherCode >= 95 && weatherCode <= 99)) {
      // 雷
      if (isNight) return '#805ad5'; // 柔らかい深い紫
      if (isDawn || isDusk) return '#9f7aea'; // 柔らかい夕暮れ/夜明けの紫
      return '#d6bcfa'; // 柔らかい昼間の紫
    }
    return '#f7fafc'; // 柔らかいデフォルト
  }
}

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
  
  // 動的な背景色と文字色を取得
  const dynamicBackgroundColor = getWeatherBackgroundColor(wCode, isDark);
  const dynamicTextColor = getTextColorForBackground(dynamicBackgroundColor);

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
    <View style={[styles.root, { backgroundColor: dynamicBackgroundColor }]}> 
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconSpacer} />
          <Text style={[styles.headerTitle, { color: dynamicTextColor }]} />
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.centerBlock}>
          <Text style={[styles.city, { color: dynamicTextColor }]}>{location}</Text>
          {loading ? (
            <View style={{ marginTop: 16 }}>
              <ActivityIndicator />
            </View>
          ) : error ? (
            <Text style={{ color: '#ef4444', marginTop: 16 }}>{error}</Text>
          ) : (
            <View style={styles.iconRow}>
              <WeatherIcon code={wCode} backgroundColor={dynamicBackgroundColor} />
              <Text style={[styles.temp, { color: dynamicTextColor }]}>
                {tempC !== null ? `${Math.round(tempC)}°` : '--'}
              </Text>
            </View>
          )}
        </View>

        {!loading && !error && (
          <View>
            <Text style={[styles.desc, { color: dynamicTextColor }]}>{weatherCodeToJa(wCode)}</Text>
            <View style={styles.details}>
              <Text style={[styles.detailText, { color: dynamicTextColor, opacity: 0.8 }]}>
                最高: {tMaxC !== null ? `${Math.round(tMaxC)}°` : '--'} / 最低: {tMinC !== null ? `${Math.round(tMinC)}°` : '--'}
              </Text>
              <Text style={[styles.detailText, { color: dynamicTextColor, opacity: 0.8 }]}>
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
            borderTopColor: dynamicTextColor,
            backgroundColor: dynamicBackgroundColor,
            opacity: 0.9,
          },
        ]}
      >
        <View style={styles.nav}>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={[styles.navIcon, { color: activeTab === 'current' ? '#ffffff' : dynamicTextColor }]}>📍</Text>
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={[styles.navLabel, { color: activeTab === 'current' ? '#ffffff' : dynamicTextColor }]}>現在地</Text>
          </View>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={[styles.navIcon, { color: activeTab === 'weekly' ? '#ffffff' : dynamicTextColor }]}>📆</Text>
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={[styles.navLabel, { color: activeTab === 'weekly' ? '#ffffff' : dynamicTextColor }]}>週間予報</Text>
          </View>
          <View style={styles.navItem}>
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={[styles.navIcon, { color: activeTab === 'settings' ? '#ffffff' : dynamicTextColor }]}>⚙️</Text>
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={[styles.navLabel, { color: activeTab === 'settings' ? '#ffffff' : dynamicTextColor }]}>設定</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WeatherScreen;
