import React from 'react';
import { ActivityIndicator, View } from 'react-native';

function Spinner() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" className="text-primary" />
    </View>
  );
}

export default Spinner;
