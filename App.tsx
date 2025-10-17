import React, { useState } from 'react';
import WeatherScreen from './components/WeatherScreen';
import WeeklyForecastScreen from './components/WeeklyForecastScreen';
import SettingsScreen from './components/SettingsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'current' | 'weekly' | 'settings'>('weekly');

  if (activeTab === 'current') {
    return <WeatherScreen activeTab={activeTab} onChangeTab={setActiveTab} />;
  }
  if (activeTab === 'settings') {
    return <SettingsScreen activeTab={activeTab} onChangeTab={setActiveTab} />;
  }
  return <WeeklyForecastScreen activeTab={activeTab} onChangeTab={setActiveTab} />;
}
