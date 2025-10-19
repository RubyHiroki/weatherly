import React from 'react';
import { useColorScheme, Animated, Easing, View } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

// 背景色に応じた雲の色を取得する関数
function getCloudColorForBackground(backgroundColor?: string): string {
  if (!backgroundColor) {
    return '#6b7280'; // デフォルトのグレー
  }
  
  // 背景色の明度を計算
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 背景が明るい場合は暗い雲、暗い場合は明るい雲
  if (brightness > 128) {
    // 明るい背景 → 暗い雲
    return '#374151';
  } else {
    // 暗い背景 → 明るい雲
    return '#d1d5db';
  }
}

type Props = {
  code: number | null | undefined;
  size?: number;
  color?: string;
  animated?: boolean;
  backgroundColor?: string; // 背景色を追加
};

export default function WeatherIcon({ code, size = 56, color, animated = true, backgroundColor }: Props) {
  const isDark = useColorScheme() === 'dark';
  
  // Hooksを常に同じ順序で呼び出す
  const progress = React.useRef(new Animated.Value(0)).current;
  
  const { iconFamily, name, tint, anim } = mapCodeToStyle(code, color, isDark);

  React.useEffect(() => {
    if (!animated) return;
    
    if (anim.type === 'rotate') {
      // 太陽の回転アニメーション - より滑らかで自然な動き
      Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration: 12000, // よりゆっくりとした回転
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else if (anim.type === 'float') {
      // 雲や曇りの浮遊アニメーション
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(progress, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    } else if (anim.type === 'pulse') {
      // 雷のパルスアニメーション
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(progress, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    } else if (anim.type === 'rain') {
      // 雨のアニメーション - より自然な動き
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, { 
            toValue: 1, 
            duration: 1500, 
            easing: Easing.out(Easing.quad), 
            useNativeDriver: true 
          }),
          Animated.timing(progress, { 
            toValue: 0, 
            duration: 1500, 
            easing: Easing.in(Easing.quad), 
            useNativeDriver: true 
          }),
        ])
      ).start();
    } else if (anim.type === 'snow') {
      // 雪のアニメーション
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(progress, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    }
    // no cleanup needed for loop
  }, [anim.type, progress, animated]);

  const style = (() => {
    if (!animated) return {};
    
    if (anim.type === 'rotate') {
      // 太陽の回転アニメーション
      const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
      return { transform: [{ rotate }] };
    }
    if (anim.type === 'float') {
      // 雲の浮遊アニメーション
      const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
      return { transform: [{ translateY }] };
    }
    if (anim.type === 'pulse') {
      // 雷のパルスアニメーション
      const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
      return { transform: [{ scale }] };
    }
    if (anim.type === 'rain') {
      // 雨のアニメーション
      const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });
      return { transform: [{ translateY }] };
    }
    if (anim.type === 'snow') {
      // 雪のアニメーション
      const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
      return { transform: [{ translateY }] };
    }
    return {};
  })();

  const renderIcon = () => {
    // 薄曇り（コード2）の特別処理：雲と太陽を別々の色で重ね合わせ
    if (code === 2) {
      return (
        <View style={{ position: 'relative', width: size, height: size }}>
          <Ionicons 
            name="cloud-outline" 
            size={size} 
            color="#6b7280" 
            style={{ position: 'absolute' }}
          />
          <Ionicons 
            name="sunny" 
            size={size * 0.5} 
            color="#f59e0b" 
            style={{ 
              position: 'absolute', 
              top: size * 0.1, 
              right: size * 0.1 
            }}
          />
        </View>
      );
    }

    const iconProps = { name: name as any, size, color: tint };
    
    if (iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons {...iconProps} />;
    }
    if (iconFamily === 'Ionicons') {
      return <Ionicons {...iconProps} />;
    }
    if (iconFamily === 'Feather') {
      return <Feather {...iconProps} />;
    }
    return <Ionicons name="help-outline" size={size} color={tint} />;
  };

  return (
    <Animated.View style={style}>
      {renderIcon()}
    </Animated.View>
  );
}

function mapCodeToStyle(code: number | null | undefined, color?: string, isDark?: boolean) {
  const defaultTint = color || (isDark ? '#ffffff' : '#000000');
  
  if (code == null) {
    return { iconFamily: 'Ionicons', name: 'help-outline', tint: defaultTint, anim: { type: 'none' } };
  }

  const map: Record<number, { iconFamily: string; name: string; tint: string; anim: { type: string } }> = {
    0: { iconFamily: 'Ionicons', name: 'sunny', tint: '#f59e0b', anim: { type: 'rotate' } },
    1: { iconFamily: 'Ionicons', name: 'partly-sunny', tint: '#f59e0b', anim: { type: 'rotate' } },
    2: { iconFamily: 'Ionicons', name: 'cloud-outline', tint: '#6b7280', anim: { type: 'float' } },
    3: { iconFamily: 'Ionicons', name: 'cloud-outline', tint: '#6b7280', anim: { type: 'float' } },
    45: { iconFamily: 'MaterialCommunityIcons', name: 'weather-fog', tint: '#9ca3af', anim: { type: 'float' } },
    48: { iconFamily: 'MaterialCommunityIcons', name: 'weather-fog', tint: '#9ca3af', anim: { type: 'float' } },
    51: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    53: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    55: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    56: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    57: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    61: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    63: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    65: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    66: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    67: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    71: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    73: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    75: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    77: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    80: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    81: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    82: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'rain' } },
    85: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    86: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    95: { iconFamily: 'MaterialCommunityIcons', name: 'weather-lightning', tint: '#fbbf24', anim: { type: 'pulse' } },
    96: { iconFamily: 'MaterialCommunityIcons', name: 'weather-lightning', tint: '#fbbf24', anim: { type: 'pulse' } },
    99: { iconFamily: 'MaterialCommunityIcons', name: 'weather-lightning', tint: '#fbbf24', anim: { type: 'pulse' } },
  };

  return map[code] || { iconFamily: 'Ionicons', name: 'help-outline', tint: defaultTint, anim: { type: 'none' } };
}