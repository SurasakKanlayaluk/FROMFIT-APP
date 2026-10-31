import { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import {
  Home, RotateCcw, Activity, CheckCircle2, AlertTriangle,
  TrendingUp, Zap, Clock, Flame, Target,
} from 'lucide-react-native';
import type { RootStackParamList, SetData } from '../navigation/AppNavigator';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Summary'>;

function formatDuration(s: number) {
  if (s < 60) return `${s} วิ`;
  const m = Math.floor(s / 60), sec = s % 60;
  return sec > 0 ? `${m}:${String(sec).padStart(2,'0')} นาที` : `${m} นาที`;
}
function gradeLabel(score: number) {
  if (score >= 90) return { text: 'ยอดเยี่ยม', emoji: '🏆' };
  if (score >= 80) return { text: 'ดีมาก',     emoji: '⭐' };
  if (score >= 68) return { text: 'ดี',          emoji: '✓' };
  return              { text: 'ต้องฝึก',          emoji: '💪' };
}
function scoreColor(score: number): string {
  if (score >= 88) return 'rgba(255,255,255,0.95)';
  if (score >= 74) return 'rgba(255,220,60,0.9)';
  return 'rgba(255,120,100,0.9)';
}

// ── Score Ring ─────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const [progress, setProgress] = useState(0);
  const r = 70; const circ = 2 * Math.PI * r;
  const grade = gradeLabel(score);

  useEffect(() => { const t = setTimeout(() => setProgress(score), 500); return () => clearTimeout(t); }, [score]);

  return (
    <View style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={180} height={180} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <SvgCircle cx={90} cy={90} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8} />
        <SvgCircle
          cx={90} cy={90} r={r}
          fill="none" stroke="white" strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress / 100)}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 45, fontWeight: '900', lineHeight: 48 }}>
          {score}<Text style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>%</Text>
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, letterSpacing: 1, marginTop: 2 }}>
          FORM SCORE
        </Text>
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 4 }}>
          {grade.emoji} {grade.text}
        </Text>
      </View>
    </View>
  );
}

// ── Analysis Bar ──────────────────────────────────────────────────────────────
function AnalysisBar({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(score), 700 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, width: 90 }}>{label}</Text>
      <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <View style={{
          height: 6, borderRadius: 3, width: `${progress}%`,
          backgroundColor: score >= 85 ? 'white' : score >= 70 ? 'rgba(255,210,50,0.85)' : 'rgba(255,100,80,0.85)',
        }} />
      </View>
      <Text style={{ fontSize: 11, fontWeight: '700', width: 36, textAlign: 'right', color: scoreColor(score) }}>
        {score}%
      </Text>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export function SummaryScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const params     = route.params;
  const insets     = useSafeAreaInsets();

  const exerciseName   = params.exerciseName   ?? 'การออกกำลังกาย';
  const exerciseNameEn = params.exerciseNameEn ?? '';
  const totalReps      = params.totalReps      ?? 0;
  const completedSets  = params.completedSets  ?? 0;
  const avgFormScore   = params.avgFormScore   ?? 0;
  const duration       = params.duration       ?? 0;
  const caloriesBurned = params.caloriesBurned ?? 0;
  const muscles        = params.muscles        ?? [];
  const setData        = params.setData        ?? [] as SetData[];

  const analysisScores = useMemo(() => {
    const seed = avgFormScore;
    const v = (r: number) => Math.max(55, Math.min(100, seed + Math.round((Math.random() - 0.5) * r)));
    return {
      'เข่า (Knee)':     v(18),
      'หลัง (Back)':     v(16),
      'ความลึก (Depth)': v(20),
      'แกนกลาง (Core)':  v(14),
    };
  }, [avgFormScore]);

  const feedbackBullets: { icon: 'good' | 'warn'; text: string }[] = [];
  if (avgFormScore >= 85) {
    feedbackBullets.push({ icon: 'good', text: 'ท่าโดยรวมดีมาก — ทำงานได้ยอดเยี่ยม!' });
    feedbackBullets.push({ icon: 'good', text: 'การควบคุมแกนกลางและสมดุลดีตลอดการฝึก' });
  } else if (avgFormScore >= 72) {
    feedbackBullets.push({ icon: 'good', text: 'ท่าอยู่ในระดับดี — มีการพัฒนาที่ชัดเจน' });
    feedbackBullets.push({ icon: 'warn', text: 'ควรเพิ่มความลึกในท่าให้มากขึ้น' });
  } else {
    feedbackBullets.push({ icon: 'warn', text: 'ต้องฝึกเพิ่มเรื่องการทรงตัวและความลึก' });
    feedbackBullets.push({ icon: 'warn', text: 'ให้ความสนใจเรื่องเข่าและหลังให้มากขึ้น' });
  }
  if (completedSets > 0) {
    feedbackBullets.push({ icon: 'good', text: `ทำครบ ${completedSets} เซต รวม ${totalReps} ครั้ง — สุดยอด!` });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#080808' }}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(500)}
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 36, height: 36, backgroundColor: '#fff', borderRadius: 10,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity color="#000" size={18} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 2 }}>สรุปผลการฝึก</Text>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>AI Report</Text>
          </View>
        </View>
        <View style={{
          paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: 1 }}>
            {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
          </Text>
        </View>
      </Animated.View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      >
        {/* Score Ring */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={{ alignItems: 'center', marginBottom: 24 }}>
          <ScoreRing score={avgFormScore} />
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 12, letterSpacing: -0.5 }}>
            {exerciseName}
          </Text>
          {exerciseNameEn !== '' && (
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>{exerciseNameEn}</Text>
          )}
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}
        >
          {[
            { icon: Zap,    label: 'ครั้งทั้งหมด', value: `${totalReps}` },
            { icon: Target, label: 'เซตเสร็จ',      value: `${completedSets}` },
            { icon: Clock,  label: 'เวลาออกกำลัง',  value: formatDuration(duration) },
            { icon: Flame,  label: 'แคลอรี่เผา',    value: `${caloriesBurned}` },
          ].map(({ icon: Icon, label, value }) => (
            <View key={label} style={{
              width: '47%', borderRadius: 16, padding: 16,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
            }}>
              <Icon color="rgba(255,255,255,0.4)" size={16} style={{ marginBottom: 8 }} />
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', lineHeight: 24 }}>{value}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 4 }}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* AI Form Analysis */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{
            borderRadius: 16, padding: 16, marginBottom: 14,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp color="rgba(255,255,255,0.6)" size={16} />
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2 }}>AI FORM ANALYSIS</Text>
          </View>
          <View style={{ gap: 12 }}>
            {Object.entries(analysisScores).map(([label, score], i) => (
              <AnalysisBar key={label} label={label} score={score} delay={i * 120} />
            ))}
          </View>
        </Animated.View>

        {/* Per-Set Breakdown */}
        {setData.length > 0 && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(400)}
            style={{
              borderRadius: 16, overflow: 'hidden', marginBottom: 14,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
            }}
          >
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              padding: 14, backgroundColor: 'rgba(255,255,255,0.05)',
            }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2 }}>รายละเอียดแต่ละเซต</Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{setData.length} เซต</Text>
            </View>
            <View style={{ padding: 12 }}>
              {(setData as SetData[]).map((set, i) => (
                <View key={i} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
                  borderBottomWidth: i < setData.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255,255,255,0.05)',
                }}>
                  <View style={{
                    width: 28, height: 28, borderRadius: 8,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>S{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' }}>
                        {set.reps} ครั้ง
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: scoreColor(set.score) }}>
                        {set.score}%
                      </Text>
                    </View>
                    <View style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.07)' }}>
                      <View style={{
                        height: 4, borderRadius: 2, width: `${set.score}%`,
                        backgroundColor: set.score >= 85 ? 'white' : set.score >= 70 ? 'rgba(255,210,50,0.85)' : 'rgba(255,100,80,0.85)',
                      }} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Muscles Worked */}
        {muscles.length > 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(450)} style={{ marginBottom: 14 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 2, marginBottom: 12 }}>
              กล้ามเนื้อที่ใช้
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {muscles.map(m => (
                <View key={m} style={{
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' }}>{m}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* AI Coach Feedback */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(500)}
          style={{
            borderRadius: 16, padding: 16,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <View style={{
              width: 28, height: 28, backgroundColor: '#fff', borderRadius: 8,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity color="#000" size={14} strokeWidth={2.5} />
            </View>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>AI Coach Feedback</Text>
          </View>
          <View style={{ gap: 12 }}>
            {feedbackBullets.map((fb, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                {fb.icon === 'good'
                  ? <CheckCircle2  color="rgba(255,255,255,0.6)" size={16} style={{ marginTop: 2 }} />
                  : <AlertTriangle color="rgba(255,200,50,0.8)"  size={16} style={{ marginTop: 2 }} />
                }
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 18, flex: 1 }}>
                  {fb.text}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* CTA Buttons */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20, paddingBottom: insets.bottom + 20, paddingTop: 16,
        backgroundColor: 'rgba(8,8,8,0.9)',
      }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CameraSetup', { id: params.exerciseId })}
            activeOpacity={0.85}
            style={{
              flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <RotateCcw color="#000" size={16} />
            <Text style={{ color: '#000', fontSize: 12, fontWeight: '800', letterSpacing: 1 }}>ฝึกอีกครั้ง</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
            style={{
              flex: 1, borderRadius: 16, paddingVertical: 16,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <Home color="rgba(255,255,255,0.7)" size={16} />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>หน้าหลัก</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
