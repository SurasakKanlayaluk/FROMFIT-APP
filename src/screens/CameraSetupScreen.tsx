import { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Camera as CameraIcon, CircleCheck, CircleAlert } from 'lucide-react-native';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import { CameraView, useCameraPermissions } from 'expo-camera'; // นำเข้า Expo Camera
import { getExercise } from '../data/exercises';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'CameraSetup'>;

const SETUP_TIPS = [
  { icon: '📏', text: 'วางห่างจากกล้อง 2–3 เมตร', ok: true  },
  { icon: '💡', text: 'ให้แสงส่องที่ตัวเพียงพอ',   ok: true  },
  { icon: '🧍', text: 'ให้ร่างกายทั้งตัวอยู่ในเฟรม', ok: false },
  { icon: '📱', text: 'วางโทรศัพท์ในแนวตั้ง',       ok: true  },
];

function CameraSetupScreenComponent() {
  const navigation     = useNavigation<Nav>();
  const route          = useRoute<Route>();
  const { id }         = route.params;
  const exercise       = getExercise(id);
  const insets         = useSafeAreaInsets();

  // ระบบขอสิทธิ์เข้าถึงกล้อง
  const [permission, requestPermission] = useCameraPermissions();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [detected, setDetected]   = useState(false);

  useEffect(() => {
    if (!exercise) {
      console.warn('Exercise not found:', id);
      navigation.goBack();
    }
  }, [exercise, id, navigation]);

  // จำลองการสแกนร่างกาย (จะทำงานเมื่อได้รับอนุญาตให้ใช้กล้องแล้ว)
  useEffect(() => {
    if (!permission?.granted) return;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setDetected(true);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timer);
  }, [permission?.granted]);

  // ระบบนับถอยหลัง
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      navigation.replace('Workout', { id });
      return;
    }
    const t = setTimeout(() => setCountdown(c => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, id, navigation]);

  if (!exercise || !permission) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  // หน้าจอขอสิทธิ์เข้าถึงกล้อง (ถ้าผู้ใช้ยังไม่กดอนุญาต)
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <CameraIcon color="#fff" size={64} style={{ marginBottom: 20 }} />
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>ต้องการเข้าถึงกล้อง</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 30 }}>
          แอปพลิเคชันจำเป็นต้องใช้งานกล้องเพื่อวิเคราะห์ท่าทางการออกกำลังกายของคุณ
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{ backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 }}
        >
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>อนุญาตการเข้าถึง</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 16,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{
          width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center',
        }}>
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 2 }}>ขั้นตอนที่ 3 จาก 3</Text>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>ตั้งวางโทรศัพท์</Text>
        </View>
      </View>

      {/* Camera Preview จริงๆ จากมือถือ */}
      <View style={{
        marginHorizontal: 20, borderRadius: 24, overflow: 'hidden',
        flex: 1, maxHeight: '55%', backgroundColor: '#0d0d0d',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
      }}>
        <CameraView style={{ flex: 1 }} facing="front">
          {/* Overlay เส้น Grid */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`h-${i}`} style={{ position: 'absolute', top: `${(i + 1) * 14}%`, left: 0, right: 0, height: 1, backgroundColor: '#fff' }} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`v-${i}`} style={{ position: 'absolute', left: `${(i + 1) * 14}%`, top: 0, bottom: 0, width: 1, backgroundColor: '#fff' }} />
            ))}
          </View>

          {/* Overlay กรอบร่างกายคน */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Svg viewBox="0 0 120 300" style={{ height: '80%', aspectRatio: 0.4 }}>
              <SvgCircle cx="60" cy="20" r="15" fill="none" stroke={detected ? '#00ff00' : '#fff'} strokeWidth="2" />
              <Path d="M60 35 L60 120 M60 55 L25 90 M60 55 L95 90 M60 120 L40 180 L50 240 M60 120 L80 180 L70 240" 
                fill="none" stroke={detected ? '#00ff00' : '#fff'} strokeWidth="2.5" strokeLinecap="round" />
            </Svg>
          </View>

          {/* ป้ายกำกับเมื่อตรวจพบ (จำลอง) */}
          {detected && (
            <View style={{ position: 'absolute', top: 16, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: '#00ff00' }}>
              <CircleCheck color="#00ff00" size={14} />
              <Text style={{ color: '#00ff00', fontSize: 9, fontWeight: '700', letterSpacing: 1 }}>
                ตรวจพบร่างกายแล้ว
              </Text>
            </View>
          )}

          {/* หลอดโหลด */}
          {!detected && (
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <View style={{ height: 3, backgroundColor: '#00ff00', width: `${scanProgress}%` }} />
            </View>
          )}
        </CameraView>
      </View>

      {/* Tips Section (ไม่มีการเปลี่ยนแปลง) */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 2, marginBottom: 12 }}>เช็คลิสต์การตั้งค่า</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SETUP_TIPS.map((tip, i) => (
            <Animated.View key={i} entering={FadeInDown.duration(400).delay(100 + i * 80)}
              style={{
                width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 10,
                backgroundColor: tip.ok ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                borderWidth: 1, borderColor: tip.ok ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
              }}>
              <Text style={{ fontSize: 16 }}>{tip.icon}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, flex: 1, lineHeight: 14 }}>{tip.text}</Text>
              {tip.ok ? <CircleCheck color="rgba(255,255,255,0.6)" size={14} /> : <CircleAlert color="rgba(255,255,255,0.3)" size={14} />}
            </Animated.View>
          ))}
        </View>

        {countdown === null ? (
          <TouchableOpacity onPress={() => setCountdown(3)} disabled={!detected} activeOpacity={0.85}
            style={{
              borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
              backgroundColor: detected ? '#fff' : 'rgba(255,255,255,0.15)', marginBottom: insets.bottom + 8,
            }}>
            <CameraIcon color={detected ? '#000' : 'rgba(255,255,255,0.4)'} size={20} />
            <Text style={{ fontSize: 13, fontWeight: '800', letterSpacing: 2, color: detected ? '#000' : 'rgba(255,255,255,0.4)' }}>
              {detected ? 'พร้อมแล้ว — เริ่มได้เลย!' : 'กำลังตรวจจับร่างกาย...'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 16, marginBottom: insets.bottom + 8 }}>
            <Text style={{ color: '#fff', fontSize: 64, fontWeight: '900' }}>{countdown}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export const CameraSetupScreen = memo(CameraSetupScreenComponent);
CameraSetupScreen.displayName = 'CameraSetupScreen';