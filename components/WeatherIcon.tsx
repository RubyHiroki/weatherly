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
  const { iconFamily, name, tint, anim } = mapCodeToStyle(code, color, isDark);

  const renderIcon = () => {
    // 薄曇り（コード2）の特別処理：雲と太陽を別々の色で重ね合わせ
    if (code === 2) {
      const cloudColor = getCloudColorForBackground(backgroundColor);
      return (
        <View style={{ position: 'relative', width: size, height: size }}>
          <Ionicons 
            name="cloud-outline" 
            size={size} 
            color={cloudColor} 
            style={{ position: 'absolute' }}
          />
          <Ionicons 
            name="sunny" 
            size={size * 0.5} 
            color="#f59e0b" 
            style={{ position: 'absolute', top: size * 0.15, left: size * 0.25 }}
          />
        </View>
      );
    }

    switch (iconFamily) {
      case 'Ionicons':
        return <Ionicons name={name as any} size={size} color={tint} />;
      case 'Feather':
        return <Feather name={name as any} size={size} color={tint} />;
      default:
        return <MaterialCommunityIcons name={name as any} size={size} color={tint} />;
    }
  };

  if (!animated || anim.type === 'none') {
    return renderIcon();
  }

  // Simple, lightweight animations without extra deps
  const progress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
      // おしゃれな雨のアニメーション - 複数の動きの組み合わせ
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(progress, { 
              toValue: 1, 
              duration: 1200, 
              easing: Easing.bezier(0.25, 0.1, 0.25, 1), 
              useNativeDriver: true 
            }),
            Animated.timing(progress, { 
              toValue: 1, 
              duration: 1200, 
              easing: Easing.inOut(Easing.sin), 
              useNativeDriver: true 
            })
          ]),
          Animated.timing(progress, { 
            toValue: 0, 
            duration: 200, 
            easing: Easing.out(Easing.back(1.2)), 
            useNativeDriver: true 
          }),
        ])
      ).start();
    } else if (anim.type === 'sunshine') {
      // 太陽の光のアニメーション - 回転とスケールの組み合わせ
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(progress, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    }
    // no cleanup needed for loop
  }, [anim.type, progress]);

  const style = (() => {
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
      // おしゃれな雨のアニメーション - 複数の動きの組み合わせ
      const translateY = progress.interpolate({ 
        inputRange: [0, 0.5, 1], 
        outputRange: [0, -6, -12] 
      });
      const translateX = progress.interpolate({ 
        inputRange: [0, 0.3, 0.7, 1], 
        outputRange: [0, 2, -1, 0] 
      });
      const scale = progress.interpolate({ 
        inputRange: [0, 0.5, 1], 
        outputRange: [1, 1.05, 1.1] 
      });
      const rotate = progress.interpolate({ 
        inputRange: [0, 1], 
        outputRange: ['0deg', '3deg'] 
      });
      const opacity = progress.interpolate({ 
        inputRange: [0, 0.8, 1], 
        outputRange: [1, 0.8, 0.4] 
      });
      return { 
        transform: [
          { translateY }, 
          { translateX }, 
          { scale }, 
          { rotate }
        ], 
        opacity 
      };
    }
    if (anim.type === 'sunshine') {
      // 太陽の光のアニメーション - スケールと回転の組み合わせ
      const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
      const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '5deg'] });
      return { transform: [{ scale }, { rotate }] };
    }
    return {};
  })();

  return (
    <Animated.View style={style}>
      {renderIcon()}
    </Animated.View>
  );
}

function mapCodeToStyle(
  code: number | null | undefined,
  overrideColor: string | undefined,
  isDark: boolean
): { iconFamily: 'MaterialCommunityIcons' | 'Ionicons' | 'Feather'; name: string; tint: string; anim: { type: 'none' | 'rotate' | 'float' | 'pulse' | 'rain' | 'sunshine' } } {
  const base = isDark ? '#e5e7eb' : '#334155';
  if (code == null) {
    return { iconFamily: 'Feather', name: 'cloud', tint: overrideColor ?? base, anim: { type: 'none' } };
  }

  // Defaults
  let iconFamily: 'MaterialCommunityIcons' | 'Ionicons' | 'Feather' = 'Feather';
  let name: string = 'cloud';
  let tint = base;
  let anim: 'none' | 'rotate' | 'float' | 'pulse' | 'rain' | 'sunshine' = 'none';

  // Color palette - より洗練された色合い
  const yellow = '#f59e0b'; // より鮮やかな黄色
  const orange = '#f97316'; // より鮮やかなオレンジ
  const blue = '#3b82f6'; // より鮮やかな青
  const cyan = '#06b6d4'; // より鮮やかなシアン
  const indigo = '#6366f1'; // インディゴ
  const gray = isDark ? '#9ca3af' : '#6b7280'; // より洗練されたグレー
  const purple = '#8b5cf6'; // 紫
  const pink = '#ec4899'; // ピンク

  switch (code) {
    case 0:
    case 1:
      iconFamily = 'Feather';
      name = 'sun';
      tint = yellow;
      anim = 'sunshine';
      break;
    case 2:
      iconFamily = 'Ionicons';
      name = 'partly-sunny';
      tint = orange;
      anim = 'float';
      break;
    case 3:
      iconFamily = 'Feather';
      name = 'cloud';
      tint = gray;
      anim = 'float';
      break;
    case 45:
    case 48:
      iconFamily = 'Feather';
      name = 'cloud-off';
      tint = gray;
      anim = 'float';
      break;
    case 51:
    case 53:
    case 55:
      iconFamily = 'Feather';
      name = 'cloud-drizzle';
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
      iconFamily = 'Feather';
      name = 'cloud-rain';
      tint = blue;
      anim = 'float';
      break;
    case 71:
    case 73:
    case 75:
    case 77:
      iconFamily = 'Feather';
      name = 'cloud-snow';
      tint = cyan;
      anim = 'float';
      break;
    case 80:
    case 81:
    case 82:
      iconFamily = 'Feather';
      name = 'cloud-rain';
      tint = blue;
      anim = 'float';
      break;
    case 85:
    case 86:
      iconFamily = 'Feather';
      name = 'cloud-snow';
      tint = cyan;
      anim = 'float';
      break;
    case 95:
    case 96:
    case 99:
      iconFamily = 'Ionicons';
      name = 'thunderstorm';
      tint = purple;
      anim = 'pulse';
      break;
    default:
      iconFamily = 'Feather';
      name = 'cloud';
      tint = gray;
      anim = 'float';
  }

  return { iconFamily, name, tint: overrideColor ?? tint, anim: { type: anim } };
}


