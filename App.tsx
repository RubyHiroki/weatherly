import React, { useState } from 'react';
import WeatherScreen from './components/WeatherScreen';
import WeeklyForecastScreen from './components/WeeklyForecastScreen';
import SettingsScreen from './components/SettingsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'current' | 'weekly' | 'settings'>('weekly');
  const [location, setLocation] = useState<string>('東京, 日本');

  if (activeTab === 'current') {
    return <WeatherScreen activeTab={activeTab} onChangeTab={setActiveTab} location={location} />;
  }
  if (activeTab === 'settings') {
    return <SettingsScreen activeTab={activeTab} onChangeTab={setActiveTab} location={location} onSaveLocation={setLocation} />;
  }
  return <WeeklyForecastScreen activeTab={activeTab} onChangeTab={setActiveTab} location={location} />;
}
