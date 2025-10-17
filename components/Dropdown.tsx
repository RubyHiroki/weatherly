import React from 'react';
import { Modal, View, Text, Pressable, TextInput, FlatList, useColorScheme } from 'react-native';

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

  const filtered = React.useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items.filter(i => i.label.includes(q));
  }, [items, query]);

  const colors = {
    bg: isDark ? '#111921' : '#ffffff',
    text: isDark ? '#ffffff' : '#0f172a',
    muted: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#197fe6',
    overlay: 'rgba(0,0,0,0.35)'
  };

  return (
    <View>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          backgroundColor: colors.bg,
          borderWidth: 1,
          borderColor: colors.border,
          height: 48,
          borderRadius: 12,
          paddingHorizontal: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Text style={{ color: value ? colors.text : colors.muted }}>
          {value || placeholder}
        </Text>
        <Text style={{ color: colors.muted }}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: colors.overlay }} onPress={() => setOpen(false)}>
          <View style={{ marginTop: '25%', marginHorizontal: 16 }}>
            <Pressable onPress={() => {}}>
              <View style={{ backgroundColor: colors.bg, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
                <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="検索"
                    placeholderTextColor={colors.muted}
                    style={{
                      backgroundColor: isDark ? '#0b1218' : '#f8fafc',
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 10,
                      height: 40,
                      paddingHorizontal: 10,
                    }}
                  />
                </View>
                <FlatList
                  data={filtered}
                  keyExtractor={(it) => it.value}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => { onChange(item.value); setOpen(false); setQuery(''); }}
                      style={({ pressed }) => ({ paddingHorizontal: 16, paddingVertical: 14, backgroundColor: pressed ? (isDark ? '#0b1218' : '#f8fafc') : 'transparent' })}
                    >
                      <Text style={{ color: colors.text }}>{item.label}</Text>
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
                  style={{ maxHeight: 360 }}
                />
                <View style={{ padding: 10, alignItems: 'flex-end' }}>
                  <Pressable onPress={() => setOpen(false)}>
                    <Text style={{ color: colors.primary, fontWeight: '600' }}>閉じる</Text>
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


