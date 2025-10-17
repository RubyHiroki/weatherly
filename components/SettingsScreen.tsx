import React from 'react';
import { View, Text, useColorScheme, Pressable } from 'react-native';
import { prefectures } from '../data/jpLocations';
import Dropdown from './Dropdown';
import { createStyles, lightColors, darkColors } from './WeatherScreen.styles';

type Props = {
  activeTab?: 'current' | 'weekly' | 'settings';
  onChangeTab?: (tab: 'current' | 'weekly' | 'settings') => void;
  location?: string;
  onSaveLocation?: (value: string) => void;
};

export default function SettingsScreen({ activeTab = 'settings', onChangeTab, location = '', onSaveLocation }: Props) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const styles = createStyles();
  const initialPref = (() => {
    const hit = prefectures.find(p => location.startsWith(p.name));
    return hit?.name ?? '東京都';
  })();
  const [pref, setPref] = React.useState<string>(initialPref);
  const cities = React.useMemo<string[]>(() => (prefectures.find(p => p.name === pref)?.cities ?? []), [pref]);
  const initialCity = (() => {
    const c = cities.find(c => location.includes(c));
    return c ?? (cities[0] ?? '千代田区');
  })();
  const [city, setCity] = React.useState<string>(initialCity);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconSpacer} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>設定</Text>
          <View style={styles.headerIconButton}>
            <Text style={{ color: colors.textMuted, fontSize: 20 }}>≡</Text>
          </View>
        </View>
      </View>

      <View style={styles.main}>
        <Dropdown
          label="都道府県"
          value={pref}
          items={prefectures.map(p => ({ label: p.name, value: p.name }))}
          onChange={(v) => {
            setPref(v);
            const nextCities = prefectures.find(p => p.name === v)?.cities ?? [];
            if (!nextCities.includes(city)) {
              setCity(nextCities[0] ?? '');
            }
          }}
        />
        <View style={{ height: 12 }} />
        <Dropdown
          label="市区町村"
          value={city}
          items={cities.map(c => ({ label: c, value: c }))}
          onChange={(v) => setCity(v)}
        />
        <Pressable
          onPress={() => {
            const loc = `${pref} ${city}`;
            if (onSaveLocation) onSaveLocation(loc);
            if (onChangeTab) onChangeTab('weekly');
          }}
          style={({ pressed }) => ({
            marginTop: 12,
            backgroundColor: pressed ? '#1e6fd0' : colors.primary,
            height: 44,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>保存して戻る</Text>
        </Pressable>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.footerBg }]}>
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
}


