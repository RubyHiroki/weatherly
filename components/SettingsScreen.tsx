import React from 'react';
import { View, Text, useColorScheme, Pressable, StatusBar, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const [showPrefModal, setShowPrefModal] = React.useState(false);
  const [showCityModal, setShowCityModal] = React.useState(false);

  // 地域設定が変更されたときに自動保存
  React.useEffect(() => {
    const loc = `${pref} ${city}`;
    if (onSaveLocation) onSaveLocation(loc);
  }, [pref, city, onSaveLocation]);

  const listItemColors = {
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
    text: isDark ? '#e2e8f0' : '#1e293b',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#374151' : '#e2e8f8',
    hover: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={{
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: colors.textPrimary,
          textAlign: 'center',
        }}>設定</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 16 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{
            backgroundColor: listItemColors.background,
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            {/* 都道府県設定 */}
            <Pressable
              style={({ pressed }) => ({
                padding: 16,
                backgroundColor: pressed ? listItemColors.hover : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              })}
              onPress={() => setShowPrefModal(true)}
            >
              <Text style={{
                fontSize: 16,
                color: listItemColors.text,
              }}>都道府県</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{
                  fontSize: 16,
                  color: listItemColors.textSecondary,
                }}>{pref}</Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={listItemColors.textSecondary} 
                />
              </View>
            </Pressable>

            <View style={{ 
              height: 1, 
              backgroundColor: listItemColors.border, 
              marginLeft: 16 
            }} />

            {/* 市区町村設定 */}
            <Pressable
              style={({ pressed }) => ({
                padding: 16,
                backgroundColor: pressed ? listItemColors.hover : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              })}
              onPress={() => setShowCityModal(true)}
            >
              <Text style={{
                fontSize: 16,
                color: listItemColors.text,
              }}>市区町村</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{
                  fontSize: 16,
                  color: listItemColors.textSecondary,
                }}>{city}</Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={listItemColors.textSecondary} 
                />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.footerBg }]}>
        <View style={styles.nav}>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'current' ? 'location' : 'location-outline'} 
              size={24} 
              color={activeTab === 'current' ? colors.primary : colors.textMuted}
              onPress={() => onChangeTab && onChangeTab('current')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('current')} style={[styles.navLabel, { color: activeTab === 'current' ? colors.primary : colors.textMuted }]}>現在地</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'weekly' ? 'calendar' : 'calendar-outline'} 
              size={24} 
              color={activeTab === 'weekly' ? colors.primary : colors.textMuted}
              onPress={() => onChangeTab && onChangeTab('weekly')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('weekly')} style={[styles.navLabel, { color: activeTab === 'weekly' ? colors.primary : colors.textMuted }]}>週間予報</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons 
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'} 
              size={24} 
              color={activeTab === 'settings' ? colors.primary : colors.textMuted}
              onPress={() => onChangeTab && onChangeTab('settings')}
            />
            <Text onPress={() => onChangeTab && onChangeTab('settings')} style={[styles.navLabel, { color: activeTab === 'settings' ? colors.primary : colors.textMuted }]}>設定</Text>
          </View>
        </View>
      </View>

      {/* 都道府県選択モーダル */}
      <Modal visible={showPrefModal} transparent animationType="fade" onRequestClose={() => setShowPrefModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowPrefModal(false)}>
          <View style={{ marginTop: '20%', marginHorizontal: 20 }}>
            <Pressable onPress={() => {}}>
              <View style={{ 
                backgroundColor: listItemColors.background, 
                borderRadius: 8, 
                overflow: 'hidden', 
                borderWidth: 1, 
                borderColor: listItemColors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View style={{ 
                  padding: 16, 
                  borderBottomWidth: 1, 
                  borderBottomColor: listItemColors.border,
                  backgroundColor: listItemColors.background
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: listItemColors.text,
                    textAlign: 'center',
                  }}>都道府県を選択</Text>
                </View>
                <FlatList
                  data={prefectures}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => { 
                        setPref(item.name);
                        setShowPrefModal(false);
                        const nextCities = item.cities ?? [];
                        if (!nextCities.includes(city)) {
                          setCity(nextCities[0] ?? '');
                        }
                      }}
                      style={({ pressed }) => ({ 
                        paddingHorizontal: 16, 
                        paddingVertical: 16, 
                        backgroundColor: pressed ? listItemColors.hover : 'transparent',
                      })}
                    >
                      <Text style={{ 
                        color: listItemColors.text, 
                        fontSize: 16,
                        fontWeight: '400'
                      }}>{item.name}</Text>
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: listItemColors.border, marginHorizontal: 16 }} />}
                  style={{ maxHeight: 360 }}
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* 市区町村選択モーダル */}
      <Modal visible={showCityModal} transparent animationType="fade" onRequestClose={() => setShowCityModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowCityModal(false)}>
          <View style={{ marginTop: '20%', marginHorizontal: 20 }}>
            <Pressable onPress={() => {}}>
              <View style={{ 
                backgroundColor: listItemColors.background, 
                borderRadius: 8, 
                overflow: 'hidden', 
                borderWidth: 1, 
                borderColor: listItemColors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View style={{ 
                  padding: 16, 
                  borderBottomWidth: 1, 
                  borderBottomColor: listItemColors.border,
                  backgroundColor: listItemColors.background
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: listItemColors.text,
                    textAlign: 'center',
                  }}>市区町村を選択</Text>
                </View>
                <FlatList
                  data={cities}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => { 
                        setCity(item);
                        setShowCityModal(false);
                      }}
                      style={({ pressed }) => ({ 
                        paddingHorizontal: 16, 
                        paddingVertical: 16, 
                        backgroundColor: pressed ? listItemColors.hover : 'transparent',
                      })}
                    >
                      <Text style={{ 
                        color: listItemColors.text, 
                        fontSize: 16,
                        fontWeight: '400'
                      }}>{item}</Text>
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: listItemColors.border, marginHorizontal: 16 }} />}
                  style={{ maxHeight: 360 }}
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}


