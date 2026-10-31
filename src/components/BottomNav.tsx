import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Home, Search, Clock, User } from 'lucide-react-native';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export type BottomNavActive = 'Home' | 'Search' | 'History' | 'Settings' | null;

const NAV_ITEMS: {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  screen: keyof RootStackParamList | null;
  activeKey: BottomNavActive;
}[] = [
  { icon: Home,   label: 'หน้าหลัก', screen: 'Home',     activeKey: 'Home'     },
  { icon: Search, label: 'ค้นหา',    screen: 'Search',   activeKey: 'Search'   },
  { icon: Clock,  label: 'ประวัติ',   screen: 'History',  activeKey: 'History'  },
  { icon: User,   label: 'โปรไฟล์',  screen: 'Settings', activeKey: 'Settings' },
];

export function BottomNav({ active }: { active: BottomNavActive }) {
  const navigation = useNavigation<Nav>();

  return (
    <View
      style={{
        paddingHorizontal: 16, paddingBottom: 32, paddingTop: 12,
        backgroundColor: 'transparent',
      }}
    >
      <View
        style={{
          flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
          borderRadius: 16, paddingVertical: 8, paddingHorizontal: 8,
        }}
      >
        {NAV_ITEMS.map(({ icon: Icon, label, screen, activeKey }) => {
          const isActive = active === activeKey;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => screen && navigation.navigate(screen as any)}
              style={{
                alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
            >
              <Icon
                size={20}
                color={isActive ? '#fff' : 'rgba(255,255,255,0.35)'}
              />
              <Text
                style={{
                  fontSize: 9,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontWeight: isActive ? '700' : '400',
                  marginTop: 3,
                  letterSpacing: 0.5,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
