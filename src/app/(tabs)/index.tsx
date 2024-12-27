import { View, Text } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { cn, styles } from '~/utils/utils';

export default function Home() {
  return (
    <View className={cn(styles.screen)}>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>About CerviScan</CardTitle>
          <CardDescription>
            CerviScan is an innovative application designed for the early detection of cervical
            cancer using Visual Inspection with Acetic Acid (VIA) images. This detection is powered
            by a machine learning model, ensuring accurate and efficient results.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <Text className="text-base text-primary">
            This project is supervised by{' '}
            <Text className="font-bold">Prof. Dr. Eng. Retno Supriyanti, S.T., M.T.</Text> and
            developed by a team of Electrical Engineering students from Universitas Jenderal
            Soedirman:
          </Text>
          <View className="flex flex-col gap-2">
            <Text className="text-base text-primary">1. M. Saujana Shafi Kehaulani</Text>
            <Text className="text-base text-primary">2. Fillipus Aditya Nugroho</Text>
            <Text className="text-base text-primary">3. Tegar Dwi Agung</Text>
            <Text className="text-base text-primary">4. M. Rizqy Maulana</Text>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
