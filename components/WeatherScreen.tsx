import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { createStyles, lightColors, darkColors } from './WeatherScreen.styles';

export const WeatherScreen: React.FC = () => {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const styles = createStyles();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconSpacer} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]} />
          <View style={styles.headerIconButton}>
            <Text style={{ color: colors.textMuted, fontSize: 20 }}>≡</Text>
          </View>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.centerBlock}>
          <Text style={[styles.city, { color: colors.textPrimary }]}>東京、日本</Text>
          <View style={styles.iconRow}>
            <Text style={styles.sunIcon}>☀️</Text>
            <Text style={[styles.temp, { color: colors.textPrimary }]}>24°</Text>
          </View>
        </View>

        <Text style={[styles.desc, { color: colors.textPrimary }]}>晴れ</Text>
        <View style={styles.details}>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>降水確率 0%</Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>最高: 28° / 最低: 20°</Text>
        </View>
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
          <View style={styles.navItemActive}>
            <Text style={[styles.navIcon, { color: colors.primary }]}>📍</Text>
            <Text style={[styles.navLabel, { color: colors.primary }]}>現在地</Text>
          </View>
          <View style={styles.navItem}>
            <Text style={[styles.navIcon, { color: colors.textMuted }]}>📅</Text>
            <Text style={[styles.navLabel, { color: colors.textMuted }]}>週間予報</Text>
          </View>
          <View style={styles.navItem}>
            <Text style={[styles.navIcon, { color: colors.textMuted }]}>⚙️</Text>
            <Text style={[styles.navLabel, { color: colors.textMuted }]}>設定</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WeatherScreen;
