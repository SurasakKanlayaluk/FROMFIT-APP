import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ArrowLeft, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react-native';
import Svg, { Line, Circle as SvgCircle } from 'react-native-svg';
import { CameraView } from 'expo-camera'; // นำเข้า CameraView
import { getExercise } from '../data/exercises';
import { ProgressRing } from '../components/ProgressRing';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Workout'>;

// ── Pose data (percentage-based) ──────────────────────────────────────────────
const STAND: Record<string, [number, number]> = {
  head:[50,7], neck:[50,13],
  lSh:[39,18], rSh:[61,18],
  lEl:[30,29], rEl:[70,29],
  lWr:[25,41], rWr:[75,41],
  sp:[50,29],
  lHi:[44,42], rHi:[56,42],
  lKn:[42,58], rKn:[58,58],
  lAn:[41,75], rAn:[59,75],
};
const SQUAT: Record<string, [number, number]> = {
  head:[50,25], neck:[50,32],
  lSh:[36,38], rSh:[64,38],
  lEl:[22,50], rEl:[78,50],
  lWr:[17,62], rWr:[83,62],
  sp:[50,51],
  lHi:[38,58], rHi:[62,58],
  lKn:[28,66], rKn:[72,66],
  lAn:[37,76], rAn:[63,76],
};
const BONES: [string, string][] = [
  ['head','neck'],['neck','lSh'],['neck','rSh'],
  ['lSh','lEl'],['rSh','rEl'],['lEl','lWr'],['rEl','rWr'],
  ['neck','sp'],['sp','lHi'],['sp','rHi'],['lHi','rHi'],
  ['lHi','lKn'],['rHi','rKn'],['lKn','lAn'],['rKn','rAn'],
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function getPos(name: string, phase: number): [number, number] {
  const s = STAND[name]; const q = SQUAT[name];
  if (!s || !q) return [50, 50];
  return [lerp(s[0], q[0], phase), lerp(s[1], q[1], phase)];
}

const ALERTS_GOOD = ['✓ ท่าสมบูรณ์แบบ!','✓ ความลึกเพอร์เฟ็กต์','✓ เข่าตรงดีมาก','✓ แกนกลางแข็งแกร่ง'];
const ALERTS_OK   = ['◎ ท่าดี — คงไว้','◎ แกนกลางดีมาก','◎ หลังตรงดี'];
const ALERTS_WARN = ['⚠ ลงลึกกว่านี้หน่อย','⚠ เข่าเกินปลายเท้าเล็กน้อย','⚠ เกร็งแกนกลางเพิ่มขึ้น'];
const ALERTS_ERR  = ['⚠ หลังตรงนะ!','⚠ หัวเข่าพับเข้าใน — แก้ด่วน!'];

// ── Skeleton SVG ───────────────────────────────────────────────────────────────
function WorkoutSkeleton({ phase, formScore, width, height }: {
  phase: number; formScore: number; width: number; height: number;
}) {
  const color = formScore >= 85
    ? 'rgba(255,255,255,0.95)'
    : formScore >= 72
    ? 'rgba(255,220,80,0.9)'
    : 'rgba(255,100,100,0.9)';

  const px = (pct: number) => (pct / 100) * width;
  const py = (pct: number) => (pct / 100) * height;

  return (
    <Svg
      width={width} height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {/* Bones */}
      {BONES.map(([a, b], i) => {
        const [px1, py1] = getPos(a, phase);
        const [px2, py2] = getPos(b, phase);
        return (
          <Line
            key={i}
            x1={px(px1)} y1={py(py1)}
            x2={px(px2)} y2={py(py2)}
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Joints */}
      {Object.keys(STAND).map(name => {
        const [cx, cy] = getPos(name, phase);
        return (
          <SvgCircle
            key={name}
            cx={px(cx)} cy={py(cy)}
            r={6}
            fill={color}
            fillOpacity={0.9}
          />
        );
      })}
    </Svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function WorkoutScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { id }     = route.params;
  const exercise   = getExercise(id);
  const insets     = useSafeAreaInsets();

  const targetReps = parseInt(exercise?.reps ?? '12');
  const totalSets  = parseInt(exercise?.sets  ?? '4');

  const [isActive,    setIsActive]    = useState(true);
  const [squatPhase,  setSquatPhase]  = useState(0);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentSet,  setCurrentSet]  = useState(1);
  const [isResting,   setIsResting]   = useState(false);
  const [restSeconds, setRestSeconds] = useState(15);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [formScore,   setFormScore]   = useState(88);
  const [aiAlert,     setAiAlert]     = useState({ msg: 'กำลังวิเคราะห์ท่า...', type: 'info' });
  const [isMuted,     setIsMuted]     = useState(false);
  const [setHistory,  setSetHistory]  = useState<{ reps: number; score: number }[]>([]);
  const [animKey,     setAnimKey]     = useState(0);
  const [svgSize,     setSvgSize]     = useState({ width: 0, height: 0 });

  const isActiveRef   = useRef(true);
  const formScoreRef  = useRef(88);
  const elapsedRef    = useRef(0);
  const setHistoryRef = useRef<{ reps: number; score: number }[]>([]);
  const currentSetRef = useRef(1);
  const doneRef       = useRef(false);

  useEffect(() => { isActiveRef.current   = isActive;   }, [isActive]);
  useEffect(() => { formScoreRef.current  = formScore;  }, [formScore]);
  useEffect(() => { currentSetRef.current = currentSet; }, [currentSet]);

  // Squat animation loop
  useEffect(() => {
    if (!isActive || isResting) return;
    doneRef.current = false;
    const REP_MS = 2200;
    const startTime = Date.now();
    let lastReps = 0;
    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const cyclePos = elapsed % REP_MS;
      const phase = (1 - Math.cos((2 * Math.PI * cyclePos) / REP_MS)) / 2;
      setSquatPhase(phase);
      const repsNow = Math.floor(elapsed / REP_MS);
      if (repsNow !== lastReps && repsNow <= targetReps) {
        lastReps = repsNow;
        setCurrentReps(repsNow);
      }
      timerId = setTimeout(tick, 33);
    };
    timerId = setTimeout(tick, 33);
    return () => clearTimeout(timerId);
  }, [isActive, isResting, animKey, targetReps]);

  // Set completion
  useEffect(() => {
    if (currentReps >= targetReps && targetReps > 0 && !doneRef.current && isActive && !isResting) {
      doneRef.current = true;
      const score = formScoreRef.current;
      const hist  = [...setHistoryRef.current, { reps: targetReps, score }];
      setHistoryRef.current = hist;
      setSetHistory(hist);
      setSquatPhase(0);

      if (currentSetRef.current >= totalSets) {
        const avgScore = Math.round(hist.reduce((s, h) => s + h.score, 0) / hist.length);
        navigation.replace('Summary', {
          exerciseId:     id,
          exerciseName:   exercise?.nameTh  ?? '',
          exerciseNameEn: exercise?.name    ?? '',
          totalReps:      hist.reduce((s, h) => s + h.reps, 0),
          completedSets:  totalSets,
          avgFormScore:   avgScore,
          duration:       elapsedRef.current,
          caloriesBurned: exercise?.calories ?? 0,
          muscles:        exercise?.muscles  ?? [],
          setData:        hist,
        });
      } else {
        setCurrentSet(s => s + 1);
        currentSetRef.current += 1;
        setCurrentReps(0);
        setIsResting(true);
        setRestSeconds(15);
      }
    }
  }, [currentReps]);

  // Rest countdown
  useEffect(() => {
    if (!isResting) return;
    if (restSeconds <= 0) { setIsResting(false); setAnimKey(k => k + 1); return; }
    const t = setTimeout(() => setRestSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [isResting, restSeconds]);

  // Global timer
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => { elapsedRef.current += 1; setElapsedSecs(elapsedRef.current); }, 1000);
    return () => clearInterval(t);
  }, [isActive]);

  // Form score noise
  useEffect(() => {
    if (!isActive || isResting) return;
    const t = setInterval(() => {
      setFormScore(prev => Math.max(62, Math.min(100, Math.round(prev + (Math.random() - 0.5) * 22))));
    }, 1800);
    return () => clearInterval(t);
  }, [isActive, isResting]);

  // AI alert
  useEffect(() => {
    const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    if      (formScore >= 90) setAiAlert({ msg: rand(ALERTS_GOOD), type: 'good' });
    else if (formScore >= 78) setAiAlert({ msg: rand(ALERTS_OK),   type: 'ok'   });
    else if (formScore >= 68) setAiAlert({ msg: rand(ALERTS_WARN), type: 'warn' });
    else                      setAiAlert({ msg: rand(ALERTS_ERR),  type: 'err'  });
  }, [formScore]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const alertStyle = ({
    good: { border: 'rgba(255,255,255,0.35)',  bg: 'rgba(255,255,255,0.1)',  text: 'rgba(255,255,255,0.9)' },
    ok:   { border: 'rgba(255,255,255,0.2)',   bg: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.7)' },
    warn: { border: 'rgba(255,210,50,0.55)',   bg: 'rgba(255,210,50,0.12)', text: 'rgba(255,225,80,0.95)'  },
    err:  { border: 'rgba(255,80,80,0.55)',    bg: 'rgba(255,80,80,0.12)',  text: 'rgba(255,120,120,0.95)' },
    info: { border: 'rgba(255,255,255,0.15)',  bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.5)' },
  } as any)[aiAlert.type] ?? { border: 'rgba(255,255,255,0.15)', bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.5)' };

  const calories = Math.round(
    ((exercise?.calories ?? 0) / totalSets) * (currentSet - 1) +
    ((exercise?.calories ?? 0) / totalSets) * (currentReps / targetReps)
  );

  const onCameraLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSvgSize({ width, height });
  };

  const handleStop = () => {
    const hist = setHistoryRef.current.length > 0
      ? setHistoryRef.current
      : [{ reps: currentReps, score: formScore }];
    const avg = Math.round(hist.reduce((s, h) => s + h.score, 0) / hist.length);
    navigation.replace('Summary', {
      exerciseId:     id,
      exerciseName:   exercise?.nameTh  ?? '',
      exerciseNameEn: exercise?.name    ?? '',
      totalReps:      hist.reduce((s, h) => s + h.reps, 0) + currentReps,
      completedSets:  currentSet,
      avgFormScore:   avg,
      duration:       elapsedRef.current,
      caloriesBurned: calories,
      muscles:        exercise?.muscles ?? [],
      setData:        hist,
    });
  };

  if (!exercise) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Camera Background ตัวจริง */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onLayout={onCameraLayout}
      >
        <CameraView 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          facing="front"
        />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' }} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', backgroundColor: 'rgba(0,0,0,0.4)' }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </View>

      {/* Skeletal Overlay */}
      {isActive && !isResting && svgSize.width > 0 && (
        <WorkoutSkeleton
          phase={squatPhase}
          formScore={formScore}
          width={svgSize.width}
          height={svgSize.height}
        />
      )}

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 12,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40, height: 40, borderRadius: 12,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: 2 }}>
            เซต {currentSet}/{totalSets}
          </Text>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>{exercise.nameTh}</Text>
        </View>

        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
        }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#f55' }} />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{formatTime(elapsedSecs)}</Text>
        </View>
      </View>

      {/* AI Alert */}
      <View style={{ alignItems: 'center', marginTop: '6%' }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16,
          backgroundColor: alertStyle.bg,
          borderWidth: 1, borderColor: alertStyle.border,
        }}>
          {!isMuted && (
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: alertStyle.text }} />
          )}
          <Text style={{ fontSize: 12, fontWeight: '700', color: alertStyle.text }}>{aiAlert.msg}</Text>
        </View>
      </View>

      {/* Set Progress Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 14 }}>
        {Array.from({ length: totalSets }).map((_, i) => (
          <View key={i} style={{
            height: 6, borderRadius: 3,
            width: i === currentSet - 1 ? 20 : 6,
            backgroundColor: i < currentSet - 1 ? '#fff'
              : i === currentSet - 1 ? 'rgba(255,255,255,0.9)'
              : 'rgba(255,255,255,0.2)',
          }} />
        ))}
      </View>

      {/* Bottom Stats Card */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: insets.bottom + 16 }}>
        <View style={{
          borderRadius: 24, padding: 20,
          backgroundColor: 'rgba(8,8,8,0.82)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
        }}>
          {/* Stats Row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 }}>
            <ProgressRing progress={formScore} size={82} strokeWidth={7} value={`${formScore}%`} label="Form" />

            {/* Rep counter */}
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 82, height: 82, alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={82} height={82} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                  <SvgCircle cx={41} cy={41} r={35} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={7} />
                  <SvgCircle
                    cx={41} cy={41} r={35}
                    fill="none" stroke="white" strokeWidth={7}
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 35}
                    strokeDashoffset={2 * Math.PI * 35 * (1 - currentReps / targetReps)}
                  />
                </Svg>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', lineHeight: 30 }}>
                    {currentReps}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, letterSpacing: 1 }}>
                    /{targetReps}
                  </Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, letterSpacing: 1, marginTop: 4 }}>ครั้ง</Text>
            </View>

            <ProgressRing
              progress={Math.round((calories / (exercise.calories || 1)) * 100)}
              size={82} strokeWidth={7}
              value={String(calories)} label="Cal"
            />
          </View>

          {/* Live feedback */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 14,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
          }}>
            <View style={{
              width: 8, height: 8, borderRadius: 4,
              backgroundColor: formScore >= 85 ? '#fff' : formScore >= 72 ? 'rgb(255,210,50)' : 'rgb(255,100,100)',
            }} />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, flex: 1 }}>
              {formScore >= 85 ? 'ท่าดีเยี่ยม — AI กำลังติดตาม'
               : formScore >= 72 ? 'แก้ไขเล็กน้อย — กำลังวิเคราะห์...'
               : 'โปรดแก้ไขท่า — AI ตรวจพบปัญหา'}
            </Text>
            <View style={{
              paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
              backgroundColor: formScore >= 85 ? 'rgba(255,255,255,0.15)' : 'rgba(255,180,0,0.2)',
            }}>
              <Text style={{
                fontSize: 9, fontWeight: '700',
                color: formScore >= 85 ? '#fff' : 'rgb(255,220,60)',
              }}>
                {formScore >= 85 ? 'GOOD' : formScore >= 72 ? 'OK' : 'FIX'}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => setIsActive(a => !a)}
              activeOpacity={0.85}
              style={{
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                borderRadius: 16, paddingVertical: 14,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              {isActive
                ? <><Pause color="#fff" size={16} fill="#fff" /><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>หยุด</Text></>
                : <><Play  color="#fff" size={16} fill="#fff" /><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>ต่อ</Text></>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsMuted(m => !m)}
              activeOpacity={0.8}
              style={{
                width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              {isMuted
                ? <VolumeX color="rgba(255,255,255,0.4)" size={16} />
                : <Volume2 color="rgba(255,255,255,0.7)" size={16} />
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStop}
              activeOpacity={0.8}
              style={{
                width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <Square color="rgba(255,255,255,0.6)" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Rest Overlay */}
      {isResting && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.88)',
            alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32,
          }}
        >
          {/* Set complete badge */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 32,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              ✓ เซต {currentSet - 1} เสร็จสิ้น
            </Text>
          </View>

          {/* Score */}
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
            คะแนนเซตนี้
          </Text>
          <Text style={{ color: '#fff', fontSize: 56, fontWeight: '900', lineHeight: 56, marginBottom: 32 }}>
            {setHistory[setHistory.length - 1]?.score ?? formScore}
            <Text style={{ fontSize: 24, color: 'rgba(255,255,255,0.4)' }}>%</Text>
          </Text>

          {/* Rest Countdown Ring */}
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 2, marginBottom: 12 }}>
            พักระหว่างเซต
          </Text>
          <View style={{ width: 112, height: 112, alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <Svg width={112} height={112} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
              <SvgCircle cx={56} cy={56} r={44} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
              <SvgCircle
                cx={56} cy={56} r={44}
                fill="none" stroke="white" strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - restSeconds / 15)}
              />
            </Svg>
            <Text style={{ color: '#fff', fontSize: 38, fontWeight: '900' }}>{restSeconds}</Text>
          </View>

          {/* Skip */}
          <TouchableOpacity
            onPress={() => { setIsResting(false); setAnimKey(k => k + 1); }}
            activeOpacity={0.85}
            style={{
              paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>
              ข้ามการพัก → เซต {currentSet}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}