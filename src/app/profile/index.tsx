import { View } from 'react-native';
import { Button } from '~/components/ui/Button';
import { useSetSession } from '~/utils/atom';
import { supabase } from '~/utils/supabase';
import { cn, styles } from '~/utils/utils';

export default function Home() {
  const setSession = useSetSession();

  return (
    <View className={cn(styles.screen, 'justify-center items-center')}>
      <Button
        label="Sign out"
        onPress={() => {
          supabase.auth.signOut();

          setSession(null);
        }}
      />
    </View>
  );
}