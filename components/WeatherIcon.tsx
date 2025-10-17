import React from 'react';
import { useColorScheme, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  code: number | null | undefined;
  size?: number;
  color?: string;
  animated?: boolean;
};

export default function WeatherIcon({ code, size = 56, color, animated = true }: Props) {
  const isDark = useColorScheme() === 'dark';
  const { name, tint, anim } = mapCodeToStyle(code, color, isDark);

  if (!animated || anim.type === 'none') {
    return <MaterialCommunityIcons name={name} size={size} color={tint} />;
  }

  // Simple, lightweight animations without extra deps
  const progress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (anim.type === 'rotate') {
      Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else if (anim.type === 'float') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(progress, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    } else if (anim.type === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(progress, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    }
    // no cleanup needed for loop
  }, [anim.type, progress]);

  const style = (() => {
    if (anim.type === 'rotate') {
      const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
      return { transform: [{ rotate }] };
    }
    if (anim.type === 'float') {
      const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
      return { transform: [{ translateY }] };
    }
    if (anim.type === 'pulse') {
      const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
      return { transform: [{ scale }] };
    }
    return {};
  })();

  return (
    <Animated.View style={style}>
      <MaterialCommunityIcons name={name} size={size} color={tint} />
    </Animated.View>
  );
}

function mapCodeToStyle(
  code: number | null | undefined,
  overrideColor: string | undefined,
  isDark: boolean
): { name: keyof typeof MaterialCommunityIcons.glyphMap; tint: string; anim: { type: 'none' | 'rotate' | 'float' | 'pulse' } } {
  const base = isDark ? '#e5e7eb' : '#334155';
  if (code == null) {
    return { name: 'weather-partly-cloudy', tint: overrideColor ?? base, anim: { type: 'none' } };
  }

  // Defaults
  let name: keyof typeof MaterialCommunityIcons.glyphMap = 'weather-partly-cloudy';
  let tint = base;
  let anim: 'none' | 'rotate' | 'float' | 'pulse' = 'none';

  // Color palette
  const yellow = '#fbbf24';
  const orange = '#fb923c';
  const blue = '#60a5fa';
  const cyan = '#22d3ee';
  const indigo = '#6366f1';
  const gray = isDark ? '#94a3b8' : '#64748b';

  switch (code) {
    case 0:
    case 1:
      name = 'weather-sunny';
      tint = yellow;
      anim = 'rotate';
      break;
    case 2:
      name = 'weather-partly-cloudy';
      tint = orange;
      anim = 'float';
      break;
    case 3:
      name = 'weather-cloudy';
      tint = gray;
      anim = 'float';
      break;
    case 45:
    case 48:
      name = 'weather-fog';
      tint = gray;
      break;
    case 51:
    case 53:
    case 55:
      name = 'weather-partly-rainy';
      tint = blue;
      anim = 'float';
      break;
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      name = 'weather-rainy';
      tint = blue;
      anim = 'float';
      break;
    case 71:
    case 73:
    case 75:
    case 77:
      name = 'weather-snowy';
      tint = cyan;
      anim = 'float';
      break;
    case 80:
    case 81:
    case 82:
      name = 'weather-pouring';
      tint = blue;
      anim = 'float';
      break;
    case 85:
    case 86:
      name = 'weather-snowy-heavy';
      tint = cyan;
      anim = 'float';
      break;
    case 95:
    case 96:
    case 99:
      name = 'weather-lightning-rainy';
      tint = indigo;
      anim = 'pulse';
      break;
    default:
      name = 'weather-partly-cloudy';
      tint = gray;
  }

  return { name, tint: overrideColor ?? tint, anim: { type: anim } };
}


