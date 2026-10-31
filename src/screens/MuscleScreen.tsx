import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { ArrowLeft, Clock, Flame, ChevronRight, Star } from 'lucide-react-native';
import { getMuscleGroup, getExercisesByMuscle } from '../data/exercises';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Muscle'>;

const diffColor: Record<string, string> = {
  Beginner:     'rgba(255,255,255,0.7)',
  Intermediate: 'rgba(255,255,255,0.5)',
  Advanced:     'rgba(255,255,255,0.9)',
};
const diffBg: Record<string, string> = {
  Beginner:     'rgba(255,255,255,0.08)',
  Intermediate: 'rgba(255,255,255,0.12)',
  Advanced:     'rgba(255,255,255,0.18)',
};
const diffTh: Record<string, string> = {
  Beginner: 'มือใหม่', Intermediate: 'กลาง', Advanced: 'สูง',
};

export function MuscleScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { id }     = route.params;
  const muscle     = getMuscleGroup(id);
  const exercises  = getExercisesByMuscle(id);
  const insets     = useSafeAreaInsets();

  if (!muscle) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* Hero */}
      <View style={{ height: 208, position: 'relative' }}>
        <Image
          source={{ uri: muscle.image }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }} />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute', top: insets.top + 12, left: 20,
            width: 40, height: 40, borderRadius: 12,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>

        {/* Hero text */}
        <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>
            เลือกท่าออกกำลังกาย
          </Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 }}>
            {muscle.nameTh}
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 16 }}
      >
        {[
          { label: 'ท่าทั้งหมด', value: `${exercises.length}` },
          { label: 'เวลาเฉลี่ย',  value: '35 นาที' },
          { label: 'แคลอรี่เฉลี่ย', value: '~180' },
        ].map(stat => (
          <View
            key={stat.label}
            style={{
              flex: 1, borderRadius: 12, padding: 12, alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>{stat.value}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, marginTop: 2 }}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Exercise List */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 20 }}>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2, marginBottom: 14 }}>
          ท่าออกกำลังกายทั้งหมด
        </Text>

        {exercises.map((exercise, i) => (
          <Animated.View key={exercise.id} entering={FadeInLeft.duration(400).delay(200 + i * 70)}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ExerciseDetail', { id: exercise.id })}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 14,
                borderRadius: 16, padding: 14, marginBottom: 10,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              {/* Thumbnail */}
              <View style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                <Image
                  source={{ uri: exercise.image }}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
                <View style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' }}>
                    {i + 1}
                  </Text>
                </View>
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 2 }}>
                  {exercise.nameTh}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 8 }}>
                  {exercise.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{
                    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
                    backgroundColor: diffBg[exercise.difficulty],
                  }}>
                    <Text style={{ color: diffColor[exercise.difficulty], fontSize: 9, fontWeight: '700' }}>
                      {diffTh[exercise.difficulty]}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Clock color="rgba(255,255,255,0.35)" size={11} />
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{exercise.duration}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Flame color="rgba(255,255,255,0.35)" size={11} />
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{exercise.calories}</Text>
                  </View>
                </View>
              </View>

              {/* Arrow */}
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <ChevronRight color="rgba(255,255,255,0.6)" size={16} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* AI Badge */}
        <View style={{
          borderRadius: 16, padding: 16, marginTop: 8, marginBottom: 32,
          flexDirection: 'row', alignItems: 'center', gap: 14,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        }}>
          <View style={{
            width: 40, height: 40, backgroundColor: '#fff', borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Star color="#000" size={20} fill="#000" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>AI Form Analysis</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, lineHeight: 16 }}>
              AI ของเราจะวิเคราะห์ท่าทางแบบเรียลไทม์ระหว่างออกกำลังกาย
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
