import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'CerviScan' }} />
      <View className={`${styles.container}`}>
        <View className={`${styles.card}`}>
          <Text className={`${styles.title}`}>About CerviScan</Text>
          <Text className={`${styles.description}`}>
            CerviScan is an innovative application designed for the early detection of cervical
            cancer using Visual Inspection with Acetic Acid (VIA) images. This detection is powered
            by a machine learning model, ensuring accurate and efficient results.
          </Text>
          <Text className={`${styles.description}`}>
            This project is supervised by{' '}
            <Text className={`${styles.bold}`}>Prof. Dr. Eng. Retno Supriyanti, S.T., M.T.</Text> and
            developed by a team of Electrical Engineering students from Universitas Jenderal
            Soedirman:
          </Text>
          <View>
            <Text className={`${styles.description}`}>1. M. Saujana Shafi</Text>
            <Text className={`${styles.description}`}>2. Fillipus Aditya Nugroho</Text>
            <Text className={`${styles.description}`}>3. Tegar Dwi Agung Saputra</Text>
            <Text className={`${styles.description}`}>4. Muhammad Rizqy Maulana Sarwono </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = {
  container: `flex-1 p-6`,
  card: `bg-white border border-gray-200 p-4 rounded-lg shadow-md mb-4`,
  title: 'text-lg font-bold mb-2',
  description: 'text-sm text-justify indent-2',
  bold: 'font-bold',
};
