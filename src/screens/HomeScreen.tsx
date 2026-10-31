import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Activity, Bell, Flame, TrendingUp, ChevronRight,
  Heart, Zap, Target, Dumbbell,
} from 'lucide-react-native';
import { muscleGroups } from '../data/exercises';
import { BottomNav } from '../components/BottomNav';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const muscleIconMap: Record<string, React.ReactElement> = {
  chest:     <Heart     color="#fff" size={22} />,
  back:      <Activity  color="#fff" size={22} />,
  legs:      <Zap       color="#fff" size={22} />,
  shoulders: <Target    color="#fff" size={22} />,
  arms:      <Dumbbell  color="#fff" size={22} />,
  core:      <Flame     color="#fff" size={22} />,
};

const WEEK_DAYS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
const DONE_DAYS = [0, 1, 2, 3];
const today = new Date().getDay();
const todayIdx = today === 0 ? 6 : today - 1;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <Animated.View
        entering={FadeInUp.duration(500)}
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 24, paddingTop: insets.top + 12, paddingBottom: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            width: 36, height: 36, backgroundColor: '#fff',
            borderRadius: 10, alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity color="#000" size={18} strokeWidth={2.5} />
          </View>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: -0.5 }}>FormFit</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity style={{
            width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
          }}>
            <Bell color="rgba(255,255,255,0.7)" size={16} />
          </TouchableOpacity>
          <View style={{
            width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)',
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
          }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>A</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      >
        {/* Welcome */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>
            สวัสดีตอนเช้า
          </Text>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 }}>
            Alex Johnson 👋
          </Text>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(150)}
          style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}
        >
          {/* Streak */}
          <View style={{
            flex: 1, borderRadius: 16, padding: 16,
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Flame color="#fff" size={14} />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: 1 }}>สตรีค</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 30, fontWeight: '900', lineHeight: 32 }}>12</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>วันต่อเนื่อง 🔥</Text>
          </View>

          {/* Weekly chart */}
          <View style={{
            flex: 2, borderRadius: 16, padding: 16,
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <TrendingUp color="#fff" size={14} />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: 1 }}>สัปดาห์นี้</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              {WEEK_DAYS.map((day, i) => {
                const isDone = DONE_DAYS.includes(i);
                const isToday = i === todayIdx;
                return (
                  <View key={day} style={{ alignItems: 'center', gap: 4 }}>
                    <View style={{
                      width: 18, borderRadius: 4,
                      height: isDone ? 24 : isToday ? 14 : 8,
                      backgroundColor: isDone ? '#fff' : isToday ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
                    }} />
                    <Text style={{
                      fontSize: 9,
                      color: isToday ? '#fff' : 'rgba(255,255,255,0.3)',
                      fontWeight: isToday ? '700' : '400',
                    }}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Today's Recommended */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Muscle', { id: 'legs' })}
            activeOpacity={0.85}
            style={{
              borderRadius: 16, overflow: 'hidden',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
              height: 144,
            }}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1675910518330-1843b4d03de1?w=800&q=80' }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              resizeMode="cover"
            />
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }} />
            <View style={{ position: 'absolute', inset: 0, padding: 20, justifyContent: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: 2, marginBottom: 6 }}>
                แนะนำวันนี้
              </Text>
              <Text style={{ color: '#fff', fontSize: 19, fontWeight: '800', marginBottom: 10 }}>
                วัน Leg Day 💪
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['6 ท่า', '45 นาที', '320 cal'].map(tag => (
                  <View key={tag} style={{
                    paddingHorizontal: 8, paddingVertical: 3,
                    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
                  }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, letterSpacing: 0.5 }}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{
              position: 'absolute', right: 16, top: '50%',
              transform: [{ translateY: -20 }],
            }}>
              <View style={{
                width: 40, height: 40, backgroundColor: '#fff',
                borderRadius: 20, alignItems: 'center', justifyContent: 'center',
              }}>
                <ChevronRight color="#000" size={20} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Muscle Groups Grid */}
        <Animated.View entering={FadeInDown.duration(500).delay(250)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>เลือกส่วนกล้ามเนื้อ</Text>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
              ทั้งหมด {muscleGroups.length} กลุ่ม
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {muscleGroups.map((muscle, i) => (
              <Animated.View
                key={muscle.id}
                entering={FadeInDown.duration(400).delay(300 + i * 60)}
                style={{ width: '47%' }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('Muscle', { id: muscle.id })}
                  activeOpacity={0.85}
                  style={{
                    height: 110, borderRadius: 16, overflow: 'hidden',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Image
                    source={{ uri: muscle.image }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    resizeMode="cover"
                  />
                  <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.65)',
                  }} />
                  <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    padding: 14, justifyContent: 'space-between',
                  }}>
                    <View style={{
                      width: 36, height: 36, borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      {muscleIconMap[muscle.id]}
                    </View>
                    <View>
                      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>{muscle.nameTh}</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 }}>
                        {muscle.exerciseCount} ท่าออกกำลังกาย
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav active="Home" />
    </View>
  );
}
