import React from 'react';
import { Modal, View, Text, Pressable, FlatList, useColorScheme, Animated } from 'react-native';

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
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const colors = {
    bg: isDark ? '#1e1e1e' : '#ffffff',
    text: isDark ? '#ffffff' : '#212121',
    muted: isDark ? '#b3b3b3' : '#757575',
    border: isDark ? '#424242' : '#e0e0e0',
    primary: '#2196f3',
    primaryDark: '#1976d2',
    surface: isDark ? '#2c2c2c' : '#f5f5f5',
    overlay: 'rgba(0,0,0,0.5)',
    shadow: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)',
    ripple: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
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
        fontSize: 12, 
        color: colors.muted, 
        marginBottom: 8,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
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
            height: 56,
            borderRadius: 4,
            paddingHorizontal: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          })}
        >
          <Text style={{ 
            color: value ? colors.text : colors.muted,
            fontSize: 16,
            fontWeight: value ? '400' : '400'
          }}>
            {value || placeholder}
          </Text>
          <Animated.Text style={{ 
            color: colors.muted, 
            fontSize: 20,
            transform: [{ rotate: rotateInterpolate }]
          }}>▼</Animated.Text>
        </Pressable>
      </Animated.View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: colors.overlay }} onPress={() => setOpen(false)}>
          <View style={{ marginTop: '20%', marginHorizontal: 20 }}>
            <Pressable onPress={() => {}}>
              <View style={{ 
                backgroundColor: colors.surface, 
                borderRadius: 4, 
                overflow: 'hidden', 
                borderWidth: 1, 
                borderColor: colors.border,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View style={{ 
                  padding: 16, 
                  borderBottomWidth: 1, 
                  borderBottomColor: colors.border,
                  backgroundColor: colors.surface
                }}>
                </View>
                <FlatList
                  data={items}
                  keyExtractor={(it) => it.value}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => { onChange(item.value); setOpen(false); }}
                      style={({ pressed }) => ({ 
                        paddingHorizontal: 16, 
                        paddingVertical: 16, 
                        backgroundColor: pressed ? colors.ripple : 'transparent',
                      })}
                    >
                      <Text style={{ 
                        color: colors.text, 
                        fontSize: 16,
                        fontWeight: '400'
                      }}>{item.label}</Text>
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 16 }} />}
                  style={{ maxHeight: 360 }}
                />
                <View style={{ 
                  padding: 16, 
                  alignItems: 'center',
                  backgroundColor: colors.surface,
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


