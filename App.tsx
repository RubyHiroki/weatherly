import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherScreen from './components/WeatherScreen';
import WeeklyForecastScreen from './components/WeeklyForecastScreen';
import SettingsScreen from './components/SettingsScreen';

const LOCATION_STORAGE_KEY = '@weatherly_location';

export default function App() {
  const [activeTab, setActiveTab] = useState<'current' | 'weekly' | 'settings'>('weekly');
  const [location, setLocation] = useState<string>('日本');
  const [isLoading, setIsLoading] = useState(true);

  // アプリ起動時に保存された地区を読み込み
  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
        if (savedLocation) {
          setLocation(savedLocation);
        }
      } catch (error) {
        console.error('地区の読み込みに失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedLocation();
  }, []);

  // 地区が変更されたときにAsyncStorageに保存
  const handleSaveLocation = async (newLocation: string) => {
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, newLocation);
      setLocation(newLocation);
    } catch (error) {
      console.error('地区の保存に失敗しました:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7f8' }}>
        <ActivityIndicator size="large" color="#197fe6" />
      </View>
    );
  }

  if (activeTab === 'current') {
    return <WeatherScreen activeTab={activeTab} onChangeTab={setActiveTab} location={location} />;
  }
  if (activeTab === 'settings') {
    return <SettingsScreen activeTab={activeTab} onChangeTab={setActiveTab} location={location} onSaveLocation={handleSaveLocation} />;
  }
  return <WeeklyForecastScreen activeTab={activeTab} onChangeTab={setActiveTab} location={location} />;
}
