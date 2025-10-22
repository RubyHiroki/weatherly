import React from 'react';
import { View, Platform } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';

type Props = {
  style?: any;
};

export default function BannerAd({ style }: Props) {
  // Test ad unit IDs for development
  const adUnitId = Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test banner ID for iOS
    android: 'ca-app-pub-3940256099942544/6300978111', // Test banner ID for Android
  });

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <AdMobBanner
        bannerSize="banner"
        adUnitID={adUnitId}
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(error) => {
          console.log('Ad failed to load:', error);
        }}
      />
    </View>
  );
}
