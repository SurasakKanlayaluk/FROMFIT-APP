import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Image, TextInput, Animated as RNAnimated, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User, Bell, Zap, Target, Shield, ChevronRight,
  Moon, Vibrate, Trophy, Flame, TrendingUp,
  LogOut, Camera, Activity, Dumbbell, Edit3, Check, X,
} from 'lucide-react-native';
import { BottomNav } from '../components/BottomNav';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const AVATAR = 'https://images.unsplash.com/photo-1770664615015-ad137461ccf5?w=600&q=80';

const GOALS = [
  { id: 'lose',     label: 'ลดน้ำหนัก',      icon: '🔥' },
  { id: 'muscle',   label: 'เพิ่มกล้ามเนื้อ', icon: '💪' },
  { id: 'endurance',label: 'เพิ่มความทนทาน',  icon: '🏃' },
  { id: 'health',   label: 'สุขภาพดีขึ้น',    icon: '❤️' },
];

// ── Toggle Component ──────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const anim = useRef(new RNAnimated.Value(value ? 1 : 0)).current;

  const handlePress = () => {
    const next = !value;
    RNAnimated.spring(anim, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      stiffness: 500,
      damping: 30,
    }).start();
    onChange(next);
  };

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 20] });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={{
        width: 42, height: 24, borderRadius: 12,
        backgroundColor: value ? '#fff' : 'rgba(255,255,255,0.12)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
      }}
    >
      <RNAnimated.View style={{
        width: 18, height: 18, borderRadius: 9,
        backgroundColor: value ? '#000' : 'rgba(255,255,255,0.4)',
        transform: [{ translateX }],
      }} />
    </TouchableOpacity>
  );
}

// ── SettingRow ─────────────────────────────────────────────────────────────────
interface SettingRowProps {
  icon: React.ReactElement;
  label: string;
  sub?: string;
  toggle?: boolean;
  toggleVal?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}
function SettingRow({ icon, label, sub, toggle, toggleVal, onToggle, onPress, danger }: SettingRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: 16, paddingVertical: 14,
      }}
    >
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: danger ? 'rgba(255,80,80,0.1)' : 'rgba(255,255,255,0.07)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 14, fontWeight: '600',
          color: danger ? 'rgba(255,100,100,0.9)' : '#fff',
        }}>
          {label}
        </Text>
        {sub && (
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{sub}</Text>
        )}
      </View>
      {toggle && onToggle ? (
        <Toggle value={!!toggleVal} onChange={onToggle} />
      ) : !danger ? (
        <ChevronRight color="rgba(255,255,255,0.25)" size={16} />
      ) : null}
    </TouchableOpacity>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 2,
        paddingHorizontal: 4, marginBottom: 8,
      }}>
        {title.toUpperCase()}
      </Text>
      <View style={{
        borderRadius: 16, overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
      }}>
        {children}
      </View>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 66 }} />;
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const insets     = useSafeAreaInsets();

  const [name, setName]                 = useState('Alex Johnson');
  const [goal, setGoal]                 = useState('muscle');
  const [notifWorkout, setNotifWorkout] = useState(true);
  const [notifStreak, setNotifStreak]   = useState(true);
  const [notifTips, setNotifTips]       = useState(false);
  const [aiVoice, setAiVoice]           = useState(true);
  const [aiSkeleton, setAiSkeleton]     = useState(true);
  const [darkMode, setDarkMode]         = useState(true);
  const [haptic, setHaptic]             = useState(true);
  const [showEditName, setShowEditName] = useState(false);
  const [showGoal, setShowGoal]         = useState(false);
  const [editNameVal, setEditNameVal]   = useState(name);
  const [selectedGoal, setSelectedGoal] = useState(goal);

  const goalLabel = GOALS.find(g => g.id === goal)?.label ?? '';
  const goalEmoji = GOALS.find(g => g.id === goal)?.icon ?? '';

  const stats = [
    { label: 'Workouts',    value: '48', icon: Dumbbell   },
    { label: 'สตรีค',       value: '12', icon: Flame      },
    { label: 'คะแนนเฉลี่ย', value: '87', icon: TrendingUp },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingTop: insets.top + 12, paddingBottom: 8,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            width: 36, height: 36, backgroundColor: '#fff', borderRadius: 10,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity color="#000" size={18} strokeWidth={2.5} />
          </View>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800' }}>โปรไฟล์</Text>
        </View>
        <TouchableOpacity
          onPress={() => { setEditNameVal(name); setShowEditName(true); }}
          style={{
            width: 36, height: 36, borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Edit3 color="rgba(255,255,255,0.7)" size={16} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      >
        {/* Avatar Card */}
        <View style={{
          borderRadius: 24, overflow: 'hidden', marginBottom: 20,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
        }}>
          {/* Blurred banner */}
          <View style={{ height: 96, overflow: 'hidden' }}>
            <Image
              source={{ uri: AVATAR }}
              style={{ width: '100%', height: 130, opacity: 0.35 }}
              resizeMode="cover"
              blurRadius={8}
            />
          </View>

          {/* Camera edit button */}
          <TouchableOpacity style={{
            position: 'absolute', top: 12, right: 12,
            width: 32, height: 32, borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Camera color="rgba(255,255,255,0.7)" size={14} />
          </TouchableOpacity>

          <View style={{ paddingHorizontal: 20, paddingBottom: 20, marginTop: -40 }}>
            {/* Avatar + name */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginBottom: 16 }}>
              <View style={{
                width: 80, height: 80, borderRadius: 18, overflow: 'hidden',
                borderWidth: 3, borderColor: '#0a0a0a',
              }}>
                <Image source={{ uri: AVATAR }} style={{ width: 80, height: 80 }} resizeMode="cover" />
              </View>
              <View style={{ paddingBottom: 4 }}>
                <Text style={{ color: '#fff', fontSize: 19, fontWeight: '800', letterSpacing: -0.5 }}>
                  {name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <View style={{
                    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                  }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600' }}>⭐ Elite</Text>
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>เริ่ม มี.ค. 2025</Text>
                </View>
              </View>
            </View>

            {/* Stats row */}
            <View style={{
              flexDirection: 'row', borderRadius: 14, padding: 12,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
            }}>
              {stats.map(({ label, value, icon: Icon }) => (
                <View key={label} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <Icon color="rgba(255,255,255,0.4)" size={14} />
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>{value}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, textAlign: 'center' }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 14,
          borderRadius: 16, padding: 16, marginBottom: 20,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        }}>
          <View style={{
            width: 40, height: 40, backgroundColor: '#fff', borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Trophy color="#000" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Level 14 — Elite</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>2,340 / 3,000 XP</Text>
            </View>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <View style={{ height: 6, borderRadius: 3, width: '78%', backgroundColor: '#fff' }} />
            </View>
          </View>
        </View>

        {/* Sections */}
        <Section title="เป้าหมาย">
          <SettingRow
            icon={<Target color="rgba(255,255,255,0.7)" size={16} />}
            label="เป้าหมายหลัก"
            sub={`${goalEmoji} ${goalLabel}`}
            onPress={() => { setSelectedGoal(goal); setShowGoal(true); }}
          />
          <Divider />
          <SettingRow
            icon={<Flame color="rgba(255,255,255,0.7)" size={16} />}
            label="แคลอรี่เป้าหมาย/วัน"
            sub="500 kcal"
          />
          <Divider />
          <SettingRow
            icon={<Dumbbell color="rgba(255,255,255,0.7)" size={16} />}
            label="จำนวนวันออกกำลังกาย/สัปดาห์"
            sub="5 วัน"
          />
        </Section>

        <Section title="AI & การออกกำลังกาย">
          <SettingRow
            icon={<Zap color="rgba(255,255,255,0.7)" size={16} />}
            label="เสียงแนะนำ AI"
            sub="แจ้งเตือนท่าระหว่างออกกำลังกาย"
            toggle toggleVal={aiVoice} onToggle={setAiVoice}
          />
          <Divider />
          <SettingRow
            icon={<Activity color="rgba(255,255,255,0.7)" size={16} />}
            label="แสดง Skeleton Overlay"
            sub="วาดโครงกระดูกบนหน้าจอกล้อง"
            toggle toggleVal={aiSkeleton} onToggle={setAiSkeleton}
          />
        </Section>

        <Section title="การแจ้งเตือน">
          <SettingRow
            icon={<Bell color="rgba(255,255,255,0.7)" size={16} />}
            label="แจ้งเตือนออกกำลังกาย"
            sub="ทุกวัน 07:00 น."
            toggle toggleVal={notifWorkout} onToggle={setNotifWorkout}
          />
          <Divider />
          <SettingRow
            icon={<Flame color="rgba(255,255,255,0.7)" size={16} />}
            label="สตรีคเตือนใจ"
            sub="อย่าลืมรักษาสตรีกของคุณ"
            toggle toggleVal={notifStreak} onToggle={setNotifStreak}
          />
          <Divider />
          <SettingRow
            icon={<Zap color="rgba(255,255,255,0.7)" size={16} />}
            label="เคล็ดลับสุขภาพ"
            sub="ทิปส์รายสัปดาห์จาก AI"
            toggle toggleVal={notifTips} onToggle={setNotifTips}
          />
        </Section>

        <Section title="ทั่วไป">
          <SettingRow
            icon={<Moon color="rgba(255,255,255,0.7)" size={16} />}
            label="โหมดมืด"
            toggle toggleVal={darkMode} onToggle={setDarkMode}
          />
          <Divider />
          <SettingRow
            icon={<Vibrate color="rgba(255,255,255,0.7)" size={16} />}
            label="การสั่นสะเทือน"
            toggle toggleVal={haptic} onToggle={setHaptic}
          />
          <Divider />
          <SettingRow
            icon={<Shield color="rgba(255,255,255,0.7)" size={16} />}
            label="ความเป็นส่วนตัว"
            sub="จัดการข้อมูลส่วนตัว"
          />
        </Section>

        <Section title="บัญชี">
          <SettingRow
            icon={<LogOut color="rgba(255,100,100,0.9)" size={16} />}
            label="ออกจากระบบ"
            danger
            onPress={() => navigation.replace('Login')}
          />
        </Section>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav active="Settings" />

      {/* Edit Name Modal */}
      <Modal visible={showEditName} transparent animationType="slide">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}
          onPress={() => setShowEditName(false)}
          activeOpacity={1}
        >
          <View style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={1}>
            <View style={{
              backgroundColor: '#161616', borderTopLeftRadius: 24, borderTopRightRadius: 24,
              padding: 24, paddingBottom: insets.bottom + 24,
              borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 16 }}>แก้ไขชื่อ</Text>
              <TextInput
                value={editNameVal}
                onChangeText={setEditNameVal}
                autoFocus
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
                  color: '#fff', fontSize: 15, marginBottom: 16,
                }}
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setShowEditName(false)}
                  style={{
                    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                    paddingVertical: 14, borderRadius: 14,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <X color="rgba(255,255,255,0.5)" size={16} />
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>ยกเลิก</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setName(editNameVal.trim() || name); setShowEditName(false); }}
                  style={{
                    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                    paddingVertical: 14, borderRadius: 14, backgroundColor: '#fff',
                  }}
                >
                  <Check color="#000" size={16} />
                  <Text style={{ color: '#000', fontSize: 13, fontWeight: '700' }}>บันทึก</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Goal Selector Modal */}
      <Modal visible={showGoal} transparent animationType="slide">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}
          onPress={() => setShowGoal(false)}
          activeOpacity={1}
        >
          <View style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={1}>
            <View style={{
              backgroundColor: '#161616', borderTopLeftRadius: 24, borderTopRightRadius: 24,
              padding: 24, paddingBottom: insets.bottom + 24,
              borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 16 }}>เป้าหมายของคุณ</Text>
              <View style={{ gap: 8, marginBottom: 16 }}>
                {GOALS.map(g => (
                  <TouchableOpacity
                    key={g.id}
                    onPress={() => setSelectedGoal(g.id)}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 12,
                      paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14,
                      backgroundColor: selectedGoal === g.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                      borderWidth: 1,
                      borderColor: selectedGoal === g.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{g.icon}</Text>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 }}>{g.label}</Text>
                    {selectedGoal === g.id && <Check color="#fff" size={16} />}
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => { setGoal(selectedGoal); setShowGoal(false); }}
                style={{
                  paddingVertical: 16, borderRadius: 14, backgroundColor: '#fff',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#000', fontSize: 14, fontWeight: '700' }}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
