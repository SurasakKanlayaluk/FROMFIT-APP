import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ArrowLeft, Clock, Flame, ChevronDown, ChevronUp,
  Play, Zap, CheckCircle2,
} from 'lucide-react-native';
import { getExercise } from '../data/exercises';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ExerciseDetail'>;

const diffTh: Record<string, string> = {
  Beginner: 'มือใหม่', Intermediate: 'ระดับกลาง', Advanced: 'ระดับสูง',
};

export function ExerciseDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { id }     = route.params;
  const exercise   = getExercise(id);
  const insets     = useSafeAreaInsets();

  const [stepsOpen, setStepsOpen] = useState(true);
  const [tipsOpen, setTipsOpen]   = useState(false);

  if (!exercise) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* Hero */}
      <View style={{ height: 256, position: 'relative' }}>
        <Image
          source={{ uri: exercise.image }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }} />

        {/* Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute', top: insets.top + 12, left: 20,
            width: 40, height: 40, borderRadius: 12,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>

        {/* Difficulty Badge */}
        <View style={{
          position: 'absolute', top: insets.top + 12, right: 20,
          paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
        }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
            {diffTh[exercise.difficulty]}
          </Text>
        </View>

        {/* Title */}
        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2, marginBottom: 4 }}>
            ท่าออกกำลังกาย
          </Text>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 }}>
            {exercise.nameTh}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
            {exercise.name}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      >
        {/* Quick Stats */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={{ flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 20 }}
        >
          {[
            { icon: Clock, label: 'ระยะเวลา', value: exercise.duration },
            { icon: Play,  label: 'เซต',      value: `${exercise.sets} เซต` },
            { icon: Zap,   label: 'ครั้ง',    value: `${exercise.reps} ครั้ง` },
            { icon: Flame, label: 'แคลอรี่',  value: `${exercise.calories}` },
          ].map(({ icon: Icon, label, value }) => (
            <View
              key={label}
              style={{
                flex: 1, borderRadius: 12, padding: 10, alignItems: 'center', gap: 4,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Icon color="rgba(255,255,255,0.5)" size={13} />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800', textAlign: 'center' }}>{value}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8, textAlign: 'center' }}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Muscles */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>
            กล้ามเนื้อที่ใช้
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {exercise.muscles.map(m => (
              <View
                key={m}
                style={{
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
                }}
              >
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' }}>{m}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>
            เกี่ยวกับท่านี้
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20 }}>
            {exercise.description}
          </Text>
        </Animated.View>

        {/* Steps Accordion */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(250)}
          style={{
            marginBottom: 12, borderRadius: 16, overflow: 'hidden',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <TouchableOpacity
            onPress={() => setStepsOpen(!stepsOpen)}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              padding: 16, backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              วิธีทำ ({exercise.steps.length} ขั้นตอน)
            </Text>
            {stepsOpen
              ? <ChevronUp color="rgba(255,255,255,0.5)" size={16} />
              : <ChevronDown color="rgba(255,255,255,0.5)" size={16} />
            }
          </TouchableOpacity>
          {stepsOpen && (
            <View style={{ padding: 16, gap: 12 }}>
              {exercise.steps.map((step, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <View style={{
                    width: 24, height: 24, borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{i + 1}</Text>
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, flex: 1 }}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Tips Accordion */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{
            borderRadius: 16, overflow: 'hidden',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <TouchableOpacity
            onPress={() => setTipsOpen(!tipsOpen)}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              padding: 16, backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              เคล็ดลับจาก AI Trainer
            </Text>
            {tipsOpen
              ? <ChevronUp color="rgba(255,255,255,0.5)" size={16} />
              : <ChevronDown color="rgba(255,255,255,0.5)" size={16} />
            }
          </TouchableOpacity>
          {tipsOpen && (
            <View style={{ padding: 16, gap: 12 }}>
              {exercise.tips.map((tip, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 color="rgba(255,255,255,0.6)" size={16} style={{ marginTop: 2 }} />
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, flex: 1 }}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* CTA Button */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, paddingBottom: insets.bottom + 20,
        backgroundColor: 'rgba(10,10,10,0.9)',
      }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CameraSetup', { id: exercise.id })}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <Play color="#000" size={20} fill="#000" />
          <Text style={{ color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 2 }}>
            เริ่มออกกำลังกาย
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
