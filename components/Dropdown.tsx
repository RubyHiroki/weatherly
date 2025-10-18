import React from 'react';
import { Modal, View, Text, Pressable, TextInput, FlatList, useColorScheme, Animated } from 'react-native';

export type DropdownItem = { label: string; value: string };

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  items: DropdownItem[];
  onChange: (value: string) => void;
};

export default function Dropdown({ label, value, placeholder = '選択してください', items, onChange }: Props) {
  const isDark = useColorScheme() === 'dark';
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const filtered = React.useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items.filter(i => i.label.includes(q));
  }, [items, query]);

  const colors = {
    bg: isDark ? '#1a1f2e' : '#ffffff',
    text: isDark ? '#ffffff' : '#0f172a',
    muted: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#197fe6',
    overlay: 'rgba(0,0,0,0.5)',
    shadow: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)',
    gradientStart: isDark ? '#2a2f3e' : '#f8fafc',
    gradientEnd: isDark ? '#1a1f2e' : '#ffffff'
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View>
      <Text style={{ 
        fontSize: 14, 
        color: colors.muted, 
        marginBottom: 8,
        fontWeight: '600',
        letterSpacing: 0.5
      }}>{label}</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={() => setOpen(true)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => ({
            backgroundColor: colors.bg,
            borderWidth: 1,
            borderColor: pressed ? colors.primary : colors.border,
            height: 52,
            borderRadius: 16,
            paddingHorizontal: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          })}
        >
          <Text style={{ 
            color: value ? colors.text : colors.muted,
            fontSize: 16,
            fontWeight: value ? '500' : '400'
          }}>
            {value || placeholder}
          </Text>
          <Animated.Text style={{ 
            color: colors.primary, 
            fontSize: 18,
            transform: [{ rotate: rotateInterpolate }]
          }}>▼</Animated.Text>
        </Pressable>
      </Animated.View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: colors.overlay }} onPress={() => setOpen(false)}>
          <View style={{ marginTop: '20%', marginHorizontal: 20 }}>
            <Pressable onPress={() => {}}>
              <View style={{ 
                backgroundColor: colors.bg, 
                borderRadius: 20, 
                overflow: 'hidden', 
                borderWidth: 1, 
                borderColor: colors.border,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 8,
              }}>
                <View style={{ 
                  padding: 16, 
                  borderBottomWidth: 1, 
                  borderBottomColor: colors.border,
                  backgroundColor: colors.gradientStart
                }}>
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="🔍 検索"
                    placeholderTextColor={colors.muted}
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      height: 44,
                      paddingHorizontal: 14,
                      fontSize: 16,
                      fontWeight: '400',
                    }}
                  />
                </View>
                <FlatList
                  data={filtered}
                  keyExtractor={(it) => it.value}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => { onChange(item.value); setOpen(false); setQuery(''); }}
                      style={({ pressed }) => ({ 
                        paddingHorizontal: 18, 
                        paddingVertical: 16, 
                        backgroundColor: pressed ? colors.gradientStart : 'transparent',
                        borderRadius: 8,
                        marginHorizontal: 8,
                        marginVertical: 2,
                      })}
                    >
                      <Text style={{ 
                        color: colors.text, 
                        fontSize: 16,
                        fontWeight: '500'
                      }}>{item.label}</Text>
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 18 }} />}
                  style={{ maxHeight: 360 }}
                />
                <View style={{ 
                  padding: 16, 
                  alignItems: 'center',
                  backgroundColor: colors.gradientStart,
                  borderTopWidth: 1,
                  borderTopColor: colors.border
                }}>
                  <Pressable 
                    onPress={() => setOpen(false)}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? colors.primary : 'transparent',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.primary,
                    })}
                  >
                    <Text style={{ 
                      color: colors.primary, 
                      fontWeight: '600',
                      fontSize: 16
                    }}>閉じる</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}


