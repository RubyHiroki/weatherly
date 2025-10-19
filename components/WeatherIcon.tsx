import React from 'react';
import { useColorScheme, Animated, Easing, View } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

type Props = {
  code: number | null | undefined;
  size?: number;
  color?: string;
  animated?: boolean;
};

export default function WeatherIcon({ code, size = 56, color, animated = true }: Props) {
  const isDark = useColorScheme() === 'dark';
  
  // Hooksを常に同じ順序で呼び出す
  const [progress] = React.useState(() => new Animated.Value(0));
  
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
      return { 
        transform: [{ 
          rotate: progress.interpolate({ 
            inputRange: [0, 1], 
            outputRange: ['0deg', '360deg'],
            extrapolate: 'clamp'
          })
        }] 
      };
    }
    if (anim.type === 'float') {
      // 雲の浮遊アニメーション
      return { 
        transform: [{ 
          translateY: progress.interpolate({ 
            inputRange: [0, 1], 
            outputRange: [0, -8],
            extrapolate: 'clamp'
          })
        }] 
      };
    }
    if (anim.type === 'pulse') {
      // 雷のパルスアニメーション
      return { 
        transform: [{ 
          scale: progress.interpolate({ 
            inputRange: [0, 1], 
            outputRange: [1, 1.15],
            extrapolate: 'clamp'
          })
        }] 
      };
    }
    if (anim.type === 'rain') {
      // 雨のアニメーション
      return { 
        transform: [{ 
          translateY: progress.interpolate({ 
            inputRange: [0, 1], 
            outputRange: [0, 4],
            extrapolate: 'clamp'
          })
        }] 
      };
    }
    if (anim.type === 'snow') {
      // 雪のアニメーション
      return { 
        transform: [{ 
          translateY: progress.interpolate({ 
            inputRange: [0, 1], 
            outputRange: [0, -6],
            extrapolate: 'clamp'
          })
        }] 
      };
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
    1: { iconFamily: 'Ionicons', name: 'sunny', tint: '#f59e0b', anim: { type: 'rotate' } },
    2: { iconFamily: 'Ionicons', name: 'cloud-outline', tint: '#6b7280', anim: { type: 'float' } },
    3: { iconFamily: 'Ionicons', name: 'cloud-outline', tint: '#6b7280', anim: { type: 'float' } },
    45: { iconFamily: 'MaterialCommunityIcons', name: 'weather-fog', tint: '#9ca3af', anim: { type: 'float' } },
    48: { iconFamily: 'MaterialCommunityIcons', name: 'weather-fog', tint: '#9ca3af', anim: { type: 'float' } },
    51: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    53: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    55: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    56: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    57: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    61: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    63: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    65: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    66: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    67: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    71: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    73: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    75: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    77: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    80: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    81: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    82: { iconFamily: 'MaterialCommunityIcons', name: 'weather-rainy', tint: '#3b82f6', anim: { type: 'float' } },
    85: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    86: { iconFamily: 'MaterialCommunityIcons', name: 'weather-snowy', tint: '#e5e7eb', anim: { type: 'snow' } },
    95: { iconFamily: 'MaterialCommunityIcons', name: 'weather-lightning', tint: '#fbbf24', anim: { type: 'pulse' } },
    96: { iconFamily: 'MaterialCommunityIcons', name: 'weather-lightning', tint: '#fbbf24', anim: { type: 'pulse' } },
    99: { iconFamily: 'MaterialCommunityIcons', name: 'weather-lightning', tint: '#fbbf24', anim: { type: 'pulse' } },
  };

  return map[code] || { iconFamily: 'Ionicons', name: 'help-outline', tint: defaultTint, anim: { type: 'none' } };
}
