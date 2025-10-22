import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hourly } from '../services/weather';

type Props = {
  hourlyData: Hourly[];
  isDark?: boolean;
};

type AdviceType = {
  umbrella: boolean;
  clothing: string;
  temperature: string;
  reason: string;
};

export default function WeatherAdvice({ hourlyData, isDark = false }: Props) {
  // 今後6時間の天気データを分析
  const futureHours = hourlyData
    .filter(hour => new Date(hour.timeIso) > new Date())
    .slice(0, 6);

  if (futureHours.length === 0) {
    return null;
  }

  // AI提案ロジック
  const generateAdvice = (): AdviceType => {
    const avgTemp = futureHours.reduce((sum, hour) => sum + hour.temperatureC, 0) / futureHours.length;
    const maxPrecip = Math.max(...futureHours.map(hour => hour.precipitationProbability));
    
    // 時間帯の判定
    const currentHour = new Date().getHours();
    const isAfternoon = currentHour >= 12 && currentHour < 18;
    const isEvening = currentHour >= 18 && currentHour < 22;
    
    // 外出時間の長さを考慮（今後6時間のデータを使用）
    const outdoorHours = futureHours.length;
    
    // 傘の必要性判定（より実用的な判定）
    let umbrella = false;
    let umbrellaReason = '';
    
    if (maxPrecip >= 80) {
      umbrella = true;
      umbrellaReason = '強い雨が予想されます';
    } else if (maxPrecip >= 60) {
      umbrella = true;
      umbrellaReason = '雨が降る可能性が高いです';
    } else if (maxPrecip >= 40) {
      umbrella = true;
      umbrellaReason = '雨が降る可能性があります';
    } else if (maxPrecip >= 30) {
      umbrella = true;
      umbrellaReason = '雨に遭う可能性があります';
    } else if (maxPrecip >= 20) {
      umbrella = true;
      umbrellaReason = '念のため傘を持参しましょう';
    } else if (maxPrecip >= 10) {
      // 降水確率10-20%: 時間帯と外出時間を考慮
      if (isAfternoon && outdoorHours >= 3) {
        umbrella = true;
        umbrellaReason = '午後の外出で雨に遭う可能性があります';
      } else if (isEvening && outdoorHours >= 2) {
        umbrella = true;
        umbrellaReason = '夕方の外出で雨に遭う可能性があります';
      } else if (outdoorHours >= 4) {
        umbrella = true;
        umbrellaReason = '長時間の外出で雨に遭う可能性があります';
      } else {
        umbrella = false;
        umbrellaReason = '雨の心配は少ないです';
      }
    } else {
      umbrella = false;
      umbrellaReason = '雨の心配はありません';
    }
    
    // 服装提案
    let clothing = '';
    let temperature = '';
    
    if (avgTemp < 5) {
      clothing = '厚手のコート・マフラー・手袋';
      temperature = 'とても寒い';
    } else if (avgTemp < 10) {
      clothing = 'コート・セーター・長袖';
      temperature = '寒い';
    } else if (avgTemp < 15) {
      clothing = 'カーディガン・長袖シャツ';
      temperature = '少し寒い';
    } else if (avgTemp < 20) {
      clothing = '薄手のカーディガン・長袖';
      temperature = '涼しい';
    } else if (avgTemp < 25) {
      clothing = '長袖シャツ・薄手の上着';
      temperature = '快適';
    } else if (avgTemp < 30) {
      clothing = '半袖・薄手の上着';
      temperature = '暖かい';
    } else {
      clothing = '半袖・涼しい服装';
      temperature = '暑い';
    }
    
    return { umbrella, clothing, temperature, reason: umbrellaReason };
  };

  const advice = generateAdvice();
  const colors = {
    background: isDark ? '#1e293b' : '#f1f5f9',
    text: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#475569',
    border: isDark ? '#334155' : '#cbd5e1',
    accent: '#197fe6',
    warning: '#3b82f6',
    success: '#10b981',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={20} color={colors.accent} />
        <Text style={[styles.title, { color: colors.text }]}>AI天気アドバイス</Text>
      </View>
      
      <View style={styles.content}>
        {/* 傘の提案 */}
        <View style={[styles.adviceItem, { 
          backgroundColor: advice.umbrella 
            ? (isDark ? '#2d1b1b' : '#fef2f2') 
            : (isDark ? '#1b2d1b' : '#f0fdf4'), 
          borderRadius: 8, 
          padding: 12 
        }]}>
          <View style={styles.adviceHeader}>
            <Ionicons 
              name={advice.umbrella ? "umbrella" : "umbrella-outline"} 
              size={18} 
              color={advice.umbrella ? colors.warning : colors.success} 
            />
            <Text style={[styles.adviceLabel, { color: colors.text }]}>
              {advice.umbrella ? '傘を持参' : '傘は不要'}
            </Text>
          </View>
          <Text style={[styles.adviceReason, { color: colors.textSecondary }]}>
            {advice.reason}
          </Text>
        </View>

        {/* 服装の提案 */}
        <View style={[styles.adviceItem, { 
          backgroundColor: isDark ? '#1b2d3d' : '#f0f9ff', 
          borderRadius: 8, 
          padding: 12 
        }]}>
          <View style={styles.adviceHeader}>
            <Ionicons name="shirt-outline" size={18} color={colors.accent} />
            <Text style={[styles.adviceLabel, { color: colors.text }]}>
              おすすめ服装
            </Text>
          </View>
          <Text style={[styles.clothingText, { color: colors.text }]}>
            {advice.clothing}
          </Text>
          <Text style={[styles.temperatureText, { color: colors.textSecondary }]}>
            {advice.temperature}（平均気温: {Math.round(futureHours.reduce((sum, hour) => sum + hour.temperatureC, 0) / futureHours.length)}°）
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    gap: 12,
  },
  adviceItem: {
    gap: 4,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adviceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  adviceReason: {
    fontSize: 12,
    marginLeft: 26,
  },
  clothingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 26,
  },
  temperatureText: {
    fontSize: 12,
    marginLeft: 26,
  },
});
