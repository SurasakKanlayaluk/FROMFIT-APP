import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import {
  Activity, Clock, Flame, Zap, Target,
  TrendingUp, ChevronRight, Calendar,
  CheckCircle2, AlertTriangle, Award,
} from 'lucide-react-native';
import { BottomNav } from '../components/BottomNav';

// ── Mock History Data ─────────────────────────────────────────────────────────
interface HistoryEntry {
  id: string;
  exerciseName:   string;
  exerciseNameEn: string;
  muscleGroup:    string;
  date:           Date;
  sets:           number;
  totalReps:      number;
  avgFormScore:   number;
  duration:       number;   // seconds
  caloriesBurned: number;
  difficulty:     'Beginner' | 'Intermediate' | 'Advanced';
}

const now = new Date();
const daysAgo = (d: number) => { const t = new Date(now); t.setDate(t.getDate() - d); return t; };

const HISTORY: HistoryEntry[] = [
  {
    id: 'h1', exerciseName: 'สควอท', exerciseNameEn: 'Squat', muscleGroup: 'ขา',
    date: daysAgo(0), sets: 4, totalReps: 48, avgFormScore: 91,
    duration: 2520, caloriesBurned: 220, difficulty: 'Intermediate',
  },
  {
    id: 'h2', exerciseName: 'เบนช์เพรส', exerciseNameEn: 'Bench Press', muscleGroup: 'อก',
    date: daysAgo(1), sets: 4, totalReps: 40, avgFormScore: 84,
    duration: 2100, caloriesBurned: 180, difficulty: 'Intermediate',
  },
  {
    id: 'h3', exerciseName: 'ดึงบาร์', exerciseNameEn: 'Pull Up', muscleGroup: 'หลัง',
    date: daysAgo(2), sets: 4, totalReps: 32, avgFormScore: 78,
    duration: 1800, caloriesBurned: 150, difficulty: 'Advanced',
  },
  {
    id: 'h4', exerciseName: 'วิดพื้น', exerciseNameEn: 'Push Up', muscleGroup: 'อก',
    date: daysAgo(3), sets: 3, totalReps: 45, avgFormScore: 95,
    duration: 1200, caloriesBurned: 80, difficulty: 'Beginner',
  },
  {
    id: 'h5', exerciseName: 'โอเวอร์เฮดเพรส', exerciseNameEn: 'Overhead Press', muscleGroup: 'ไหล่',
    date: daysAgo(4), sets: 4, totalReps: 40, avgFormScore: 82,
    duration: 2400, caloriesBurned: 160, difficulty: 'Intermediate',
  },
  {
    id: 'h6', exerciseName: 'แพลงก์', exerciseNameEn: 'Plank', muscleGroup: 'แกนกลาง',
    date: daysAgo(5), sets: 3, totalReps: 3, avgFormScore: 88,
    duration: 900, caloriesBurned: 50, difficulty: 'Beginner',
  },
  {
    id: 'h7', exerciseName: 'โรว์ก้มตัว', exerciseNameEn: 'Bent-Over Row', muscleGroup: 'หลัง',
    date: daysAgo(7), sets: 4, totalReps: 40, avgFormScore: 76,
    duration: 2400, caloriesBurned: 160, difficulty: 'Intermediate',
  },
  {
    id: 'h8', exerciseName: 'บิเซปเคิร์ล', exerciseNameEn: 'Bicep Curl', muscleGroup: 'แขน',
    date: daysAgo(8), sets: 3, totalReps: 36, avgFormScore: 89,
    duration: 1500, caloriesBurned: 90, difficulty: 'Beginner',
  },
  {
    id: 'h9', exerciseName: 'ลันจ์', exerciseNameEn: 'Lunge', muscleGroup: 'ขา',
    date: daysAgo(10), sets: 3, totalReps: 36, avgFormScore: 80,
    duration: 1500, caloriesBurned: 140, difficulty: 'Beginner',
  },
  {
    id: 'h10', exerciseName: 'ยกข้าง', exerciseNameEn: 'Lateral Raise', muscleGroup: 'ไหล่',
    date: daysAgo(12), sets: 3, totalReps: 45, avgFormScore: 93,
    duration: 1200, caloriesBurned: 80, difficulty: 'Beginner',
  },
  {
    id: 'h11', exerciseName: 'ทรายเซปดิป', exerciseNameEn: 'Tricep Dip', muscleGroup: 'แขน',
    date: daysAgo(14), sets: 3, totalReps: 36, avgFormScore: 74,
    duration: 1800, caloriesBurned: 110, difficulty: 'Intermediate',
  },
  {
    id: 'h12', exerciseName: 'ครันซ์', exerciseNameEn: 'Crunch', muscleGroup: 'แกนกลาง',
    date: daysAgo(16), sets: 3, totalReps: 60, avgFormScore: 87,
    duration: 1200, caloriesBurned: 60, difficulty: 'Beginner',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDuration(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec} วิ`;
  return sec > 0 ? `${m}:${String(sec).padStart(2, '0')} น.` : `${m} นาที`;
}

function formatDate(d: Date): string {
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'วันนี้';
  if (diff === 1) return 'เมื่อวาน';
  if (diff < 7)  return `${diff} วันที่แล้ว`;
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}

function scoreColor(score: number): string {
  if (score >= 88) return 'rgba(255,255,255,0.95)';
  if (score >= 74) return 'rgba(255,220,60,0.9)';
  return 'rgba(255,120,100,0.9)';
}

function gradeLabel(score: number): { text: string; emoji: string } {
  if (score >= 90) return { text: 'ยอดเยี่ยม', emoji: '🏆' };
  if (score >= 80) return { text: 'ดีมาก',     emoji: '⭐' };
  if (score >= 68) return { text: 'ดี',         emoji: '✓' };
  return              { text: 'ต้องฝึก',         emoji: '💪' };
}

const DIFF_COLOR: Record<string, string> = {
  Beginner:     'rgba(160,255,160,0.15)',
  Intermediate: 'rgba(255,220,80,0.15)',
  Advanced:     'rgba(255,100,100,0.15)',
};
const DIFF_TEXT: Record<string, string> = {
  Beginner:     'rgba(160,255,160,0.85)',
  Intermediate: 'rgba(255,220,80,0.85)',
  Advanced:     'rgba(255,100,100,0.85)',
};
const DIFF_TH: Record<string, string> = {
  Beginner:     'เริ่มต้น',
  Intermediate: 'ปานกลาง',
  Advanced:     'ขั้นสูง',
};

// ── Mini Score Ring ───────────────────────────────────────────────────────────
function MiniRing({ score }: { score: number }) {
  const r = 20; const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={52} height={52} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <SvgCircle cx={26} cy={26} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4} />
        <SvgCircle
          cx={26} cy={26} r={r} fill="none"
          stroke={scoreColor(score)} strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)}
        />
      </Svg>
      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{score}</Text>
    </View>
  );
}

// ── History Card ──────────────────────────────────────────────────────────────
function HistoryCard({ entry, index }: { entry: HistoryEntry; index: number }) {
  const grade = gradeLabel(entry.avgFormScore);
  return (
    <Animated.View entering={FadeInDown.duration(350).delay(index * 55)}>
      <View style={{
        borderRadius: 18, marginBottom: 12, overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
      }}>
        {/* Top Row */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
          borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {/* Difficulty badge */}
              <View style={{
                paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
                backgroundColor: DIFF_COLOR[entry.difficulty],
              }}>
                <Text style={{ color: DIFF_TEXT[entry.difficulty], fontSize: 8, fontWeight: '700' }}>
                  {DIFF_TH[entry.difficulty]}
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                {entry.muscleGroup}
              </Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: -0.3 }}>
              {entry.exerciseName}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 1 }}>
              {entry.exerciseNameEn}
            </Text>
          </View>
          {/* Score Ring */}
          <MiniRing score={entry.avgFormScore} />
        </View>

        {/* Stats Row */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 16, paddingVertical: 12, gap: 0,
        }}>
          {[
            { icon: Target, val: `${entry.sets} เซต`,          label: 'เซต' },
            { icon: Zap,    val: `${entry.totalReps} ครั้ง`,    label: 'ครั้ง' },
            { icon: Clock,  val: formatDuration(entry.duration), label: 'เวลา' },
            { icon: Flame,  val: `${entry.caloriesBurned}`,      label: 'cal' },
          ].map(({ icon: Icon, val, label }, i, arr) => (
            <View key={label} style={{
              flex: 1, alignItems: 'center',
              borderRightWidth: i < arr.length - 1 ? 1 : 0,
              borderRightColor: 'rgba(255,255,255,0.06)',
            }}>
              <Icon color="rgba(255,255,255,0.3)" size={13} />
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800', marginTop: 4 }}>{val}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginTop: 1 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 16, paddingVertical: 10,
          borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {entry.avgFormScore >= 68
              ? <CheckCircle2 color="rgba(255,255,255,0.4)" size={13} />
              : <AlertTriangle color="rgba(255,200,50,0.6)" size={13} />
            }
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              {grade.emoji} {grade.text}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Calendar color="rgba(255,255,255,0.25)" size={12} />
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
              {formatDate(entry.date)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ── Filter Tab ────────────────────────────────────────────────────────────────
function FilterTab({
  label, active, onPress,
}: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
        backgroundColor: active ? '#fff' : 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: active ? '#fff' : 'rgba(255,255,255,0.12)',
      }}
    >
      <Text style={{
        color: active ? '#000' : 'rgba(255,255,255,0.6)',
        fontSize: 12, fontWeight: active ? '700' : '500',
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [tab,  setTab]  = useState<'all' | 'week' | 'month'>('all');

  const filtered = HISTORY.filter(e => {
    if (tab === 'week')  return (now.getTime() - e.date.getTime()) < 7  * 86400000;
    if (tab === 'month') return (now.getTime() - e.date.getTime()) < 30 * 86400000;
    return true;
  });

  // Summary stats
  const totalWorkouts = filtered.length;
  const totalCalories = filtered.reduce((s, e) => s + e.caloriesBurned, 0);
  const avgScore      = filtered.length
    ? Math.round(filtered.reduce((s, e) => s + e.avgFormScore, 0) / filtered.length)
    : 0;
  const totalMinutes  = Math.round(filtered.reduce((s, e) => s + e.duration, 0) / 60);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* ── Header ── */}
      <Animated.View
        entering={FadeInUp.duration(450)}
        style={{
          paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            width: 36, height: 36, backgroundColor: '#fff', borderRadius: 10,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity color="#000" size={18} strokeWidth={2.5} />
          </View>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: -0.5 }}>
            ประวัติการฝึก
          </Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ── Summary Stats ── */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(80)}
          style={{ paddingHorizontal: 20, marginBottom: 16 }}
        >
          <View style={{
            borderRadius: 20, overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            padding: 20,
          }}>
            {/* Top label */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp color="rgba(255,255,255,0.5)" size={14} />
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 2 }}>
                สถิติภาพรวม
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              {[
                { icon: Award, val: String(totalWorkouts),  label: 'Workouts' },
                { icon: Flame, val: String(totalCalories),  label: 'แคลอรี่' },
                { icon: TrendingUp, val: `${avgScore}%`,    label: 'คะแนนเฉลี่ย' },
                { icon: Clock, val: `${totalMinutes}`,      label: 'นาที' },
              ].map(({ icon: Icon, val, label }, i, arr) => (
                <View key={label} style={{
                  flex: 1, alignItems: 'center',
                  borderRightWidth: i < arr.length - 1 ? 1 : 0,
                  borderRightColor: 'rgba(255,255,255,0.07)',
                }}>
                  <Icon color="rgba(255,255,255,0.35)" size={14} />
                  <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 6 }}>{val}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, textAlign: 'center', marginTop: 2 }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ── Streak Banner ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(140)}
          style={{ paddingHorizontal: 20, marginBottom: 16 }}
        >
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 14,
            borderRadius: 16, padding: 14,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
          }}>
            <View style={{
              width: 42, height: 42, backgroundColor: '#fff', borderRadius: 12,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 20 }}>🔥</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>
                12 วันต่อเนื่อง!
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>
                รักษาสตรีคของคุณไว้ — อีก 1 วัน สู่ระดับใหม่! 🎯
              </Text>
            </View>
            <ChevronRight color="rgba(255,255,255,0.2)" size={18} />
          </View>
        </Animated.View>

        {/* ── Filter Tabs ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(180)}
          style={{ paddingHorizontal: 20, marginBottom: 16 }}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <FilterTab label="ทั้งหมด"   active={tab === 'all'}   onPress={() => setTab('all')} />
            <FilterTab label="สัปดาห์นี้" active={tab === 'week'}  onPress={() => setTab('week')} />
            <FilterTab label="เดือนนี้"   active={tab === 'month'} onPress={() => setTab('month')} />
          </View>
        </Animated.View>

        {/* ── Session Count ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <Text style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>
            {filtered.length} เซสชันออกกำลังกาย
          </Text>
        </View>

        {/* ── List ── */}
        <View style={{ paddingHorizontal: 20 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Calendar color="rgba(255,255,255,0.1)" size={48} />
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: '600', marginTop: 16 }}>
                ยังไม่มีประวัติการฝึก
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 6 }}>
                เริ่มออกกำลังกายแล้วผลจะแสดงที่นี่
              </Text>
            </View>
          ) : (
            filtered.map((entry, i) => (
              <HistoryCard key={entry.id} entry={entry} index={i} />
            ))
          )}
        </View>
      </ScrollView>

      <BottomNav active="History" />
    </View>
  );
}
