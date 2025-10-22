import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  style?: any;
};

export default function BannerAd({ style }: Props) {
  // 一時的に広告を無効化（開発中）
  return (
    <View style={[{ 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: 50,
      backgroundColor: '#f0f0f0',
      marginVertical: 8
    }, style]}>
      <Text style={{ color: '#666', fontSize: 12 }}>広告エリア（開発中）</Text>
    </View>
  );
}
