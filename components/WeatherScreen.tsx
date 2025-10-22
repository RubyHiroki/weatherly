import React from 'react';
import { View, Text, useColorScheme, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles, lightColors, darkColors } from './WeatherScreen.styles';
import { geocode, fetchCurrent, fetchTodayForecast, fetchDaily, fetchHourly, Hourly } from '../services/weather';
import { weatherCodeToJa } from '../services/weatherCodes';
import WeatherIcon from './WeatherIcon';
import WeatherAdvice from './WeatherAdvice';
import BannerAd from './BannerAd';

// 時間をフォーマットする関数
function formatTime(timeIso: string): string {
  const date = new Date(timeIso);
  return date.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
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

const WeatherScreen: React.FC<Props> = ({ activeTab = 'current', onChangeTab, location = '日本' }) => {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const styles = createStyles();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tempC, setTempC] = React.useState<number | null>(null);
  const [wCode, setWCode] = React.useState<number | null>(null);
  const [tMaxC, setTMaxC] = React.useState<number | null>(null);
  const [tMinC, setTMinC] = React.useState<number | null>(null);
  const [precipitationProbability, setPrecipitationProbability] = React.useState<number | null>(null);
  const [hourlyData, setHourlyData] = React.useState<Hourly[]>([]);
  
  // 動的な背景色と文字色を取得
  const dynamicBackgroundColor = getWeatherBackgroundColor(wCode, isDark);
  const dynamicTextColor = isDark ? '#f8fafc' : '#1e293b';

  React.useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const g = await geocode(location);
        const [cur, todayForecast, dailyData, hourlyData] = await Promise.all([
          fetchCurrent(g.latitude, g.longitude),
          fetchTodayForecast(g.latitude, g.longitude),
          fetchDaily(g.latitude, g.longitude),
          fetchHourly(g.latitude, g.longitude)
        ]);
        if (!mounted) return;
        setTempC(cur.temperatureC);
        // 週間予報と同じデータソース（今日の予報）を使用
        setWCode(dailyData[0]?.weatherCode ?? cur.weatherCode);
        setTMaxC(todayForecast.tMaxC);
        setTMinC(todayForecast.tMinC);
        setPrecipitationProbability(todayForecast.precipitationProbability);
        setHourlyData(hourlyData);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : '取得に失敗しました');
        setTempC(null);
        setWCode(null);
        setTMaxC(null);
        setTMinC(null);
        setPrecipitationProbability(null);
        setHourlyData([]);
      } finally {
        mounted && setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [location]);

  return (
    <View style={[styles.root, { backgroundColor: dynamicBackgroundColor }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={dynamicBackgroundColor} />

      <View style={styles.main}>
        <View style={styles.centerBlock}>
          <Text style={[styles.city, { color: dynamicTextColor }]}>{location}</Text>
          {loading || wCode == null ? (
            <View style={{ marginTop: 16 }}>
              <ActivityIndicator color={isDark ? '#ffffff' : '#1e293b'} />
            </View>
          ) : error ? (
            <Text style={{ color: '#ef4444', marginTop: 16 }}>{error}</Text>
          ) : (
            <View style={styles.iconRow}>
              <WeatherIcon code={wCode} />
              <Text style={[styles.temp, { color: dynamicTextColor }]}>
                {tempC !== null ? `${Math.round(tempC)}°` : '--'}
              </Text>
            </View>
          )}
        </View>

        {!loading && !error && wCode != null && (
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

      {/* 1時間毎の天気 */}
      {!loading && !error && hourlyData.length > 0 && (
        <View style={[styles.hourlyContainer, { backgroundColor: dynamicBackgroundColor, opacity: 0.9 }]}>
          <Text style={[styles.hourlyTitle, { color: dynamicTextColor }]}>1時間毎の天気</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyScrollContent}
          >
            {hourlyData
              .filter(hour => new Date(hour.timeIso) > new Date()) // 現在時刻より後の時間のみ
              .slice(0, 8) // 最大8時間
              .map((hour, index) => (
              <View key={index} style={styles.hourlyItem}>
                <Text style={[styles.hourlyTime, { color: dynamicTextColor }]}>
                  {formatTime(hour.timeIso)}
                </Text>
                <WeatherIcon 
                  code={hour.weatherCode} 
                  size={32} 
                />
                <Text style={[styles.hourlyWeather, { color: dynamicTextColor, opacity: 0.8 }]}>
                  {weatherCodeToJa(hour.weatherCode)}
                </Text>
                <Text style={[styles.hourlyTemp, { color: dynamicTextColor }]}>
                  {Math.round(hour.temperatureC)}°
                </Text>
                <Text style={[styles.hourlyPrecip, { color: dynamicTextColor, opacity: 0.7 }]}>
                  {Math.round(hour.precipitationProbability)}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* AI天気アドバイス */}
      {!loading && !error && hourlyData.length > 0 && (
        <WeatherAdvice hourlyData={hourlyData} isDark={isDark} />
      )}

      {/* バナー広告 */}
      <BannerAd style={{ marginVertical: 8 }} />

      <View
        style={[
          styles.footer,
          {
            backgroundColor: dynamicBackgroundColor,
            opacity: 0.9,
          },
        ]}
      >
        <View style={styles.nav}>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'current' ? 'partly-sunny' : 'partly-sunny-outline'} 
              size={24} 
              color={activeTab === 'current' ? '#ffffff' : (isDark ? '#ffffff' : '#1e293b')}
              onPress={() => onChangeTab && onChangeTab('current')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={[styles.navLabel, { color: activeTab === 'current' ? '#ffffff' : (isDark ? '#ffffff' : '#1e293b') }]}>天気予報</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'weekly' ? 'calendar' : 'calendar-outline'} 
              size={24} 
              color={activeTab === 'weekly' ? '#ffffff' : (isDark ? '#ffffff' : '#1e293b')}
              onPress={() => onChangeTab && onChangeTab('weekly')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={[styles.navLabel, { color: activeTab === 'weekly' ? '#ffffff' : (isDark ? '#ffffff' : '#1e293b') }]}>週間予報</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'} 
              size={24} 
              color={activeTab === 'settings' ? '#ffffff' : (isDark ? '#ffffff' : '#1e293b')}
              onPress={() => onChangeTab && onChangeTab('settings')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={[styles.navLabel, { color: activeTab === 'settings' ? '#ffffff' : (isDark ? '#ffffff' : '#1e293b') }]}>設定</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WeatherScreen;
