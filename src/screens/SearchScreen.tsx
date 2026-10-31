import { useState, useMemo } from 'react';
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, FlatList, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Search, X, ChevronRight, Activity,
  Flame, Zap, Clock, Filter,
  Heart, Target, Dumbbell,
} from 'lucide-react-native';
import { exercises, muscleGroups } from '../data/exercises';
import type { Exercise } from '../data/exercises';
import { BottomNav } from '../components/BottomNav';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner:     'rgba(160,255,160,0.15)',
  Intermediate: 'rgba(255,220,80,0.15)',
  Advanced:     'rgba(255,100,100,0.15)',
};
const DIFFICULTY_TEXT: Record<string, string> = {
  Beginner:     'rgba(160,255,160,0.9)',
  Intermediate: 'rgba(255,220,80,0.9)',
  Advanced:     'rgba(255,100,100,0.9)',
};
const DIFFICULTY_TH: Record<string, string> = {
  Beginner:     'เริ่มต้น',
  Intermediate: 'ปานกลาง',
  Advanced:     'ขั้นสูง',
};

const muscleIconMap: Record<string, React.ReactElement> = {
  chest:     <Heart     color="rgba(255,255,255,0.7)" size={14} />,
  back:      <Activity  color="rgba(255,255,255,0.7)" size={14} />,
  legs:      <Zap       color="rgba(255,255,255,0.7)" size={14} />,
  shoulders: <Target    color="rgba(255,255,255,0.7)" size={14} />,
  arms:      <Dumbbell  color="rgba(255,255,255,0.7)" size={14} />,
  core:      <Flame     color="rgba(255,255,255,0.7)" size={14} />,
};

// ── Exercise Card ─────────────────────────────────────────────────────────────
function ExerciseCard({ item, onPress, index }: { item: Exercise; onPress: () => void; index: number }) {
  const muscle = muscleGroups.find(m => m.id === item.muscleId);
  return (
    <Animated.View entering={FadeInDown.duration(350).delay(index * 50)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.82}
        style={{
          flexDirection: 'row', alignItems: 'center',
          borderRadius: 16, overflow: 'hidden',
          marginBottom: 10,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
        }}
      >
        {/* Thumbnail */}
        <View style={{ width: 80, height: 80 }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: 80, height: 80 }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
          }} />
          <View style={{
            position: 'absolute', bottom: 6, left: 6,
            paddingHorizontal: 5, paddingVertical: 2,
            borderRadius: 6,
            backgroundColor: DIFFICULTY_COLOR[item.difficulty],
          }}>
            <Text style={{ color: DIFFICULTY_TEXT[item.difficulty], fontSize: 8, fontWeight: '700' }}>
              {DIFFICULTY_TH[item.difficulty]}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 2 }}>
            {item.nameTh}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 8 }}>
            {item.name}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {muscleIconMap[item.muscleId]}
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>
                {muscle?.nameTh ?? item.muscleId}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Clock color="rgba(255,255,255,0.4)" size={12} />
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{item.duration}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Flame color="rgba(255,255,255,0.4)" size={12} />
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{item.calories} cal</Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <View style={{ paddingRight: 14 }}>
          <ChevronRight color="rgba(255,255,255,0.2)" size={18} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const insets     = useSafeAreaInsets();

  const [query,         setQuery]         = useState('');
  const [activeFilter,  setActiveFilter]  = useState<string | null>(null);
  const [activeDiff,    setActiveDiff]    = useState<string | null>(null);
  const [showFilter,    setShowFilter]    = useState(false);

  const filtered = useMemo(() => {
    let list = exercises;
    if (activeFilter) list = list.filter(e => e.muscleId === activeFilter);
    if (activeDiff)   list = list.filter(e => e.difficulty === activeDiff);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.nameTh.includes(q) ||
        e.muscles.some(m => m.toLowerCase().includes(q))
      );
    }
    return list;
  }, [query, activeFilter, activeDiff]);

  const filterCount = (activeFilter ? 1 : 0) + (activeDiff ? 1 : 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* ── Header ── */}
      <View style={{
        paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 12,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <View style={{
            width: 36, height: 36, backgroundColor: '#fff', borderRadius: 10,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity color="#000" size={18} strokeWidth={2.5} />
          </View>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: -0.5 }}>
            ค้นหาท่าออกกำลังกาย
          </Text>
        </View>
      </View>

      {/* ── Search Bar ── */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: 'rgba(255,255,255,0.07)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
          borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
        }}>
          <Search color="rgba(255,255,255,0.4)" size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="ค้นหาท่า, กล้ามเนื้อ..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            style={{ flex: 1, color: '#fff', fontSize: 14 }}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X color="rgba(255,255,255,0.4)" size={16} />
            </TouchableOpacity>
          )}
          {/* Filter button */}
          <TouchableOpacity
            onPress={() => setShowFilter(v => !v)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 4,
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
              backgroundColor: filterCount > 0
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: filterCount > 0
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(255,255,255,0.1)',
            }}
          >
            <Filter color={filterCount > 0 ? '#fff' : 'rgba(255,255,255,0.4)'} size={14} />
            {filterCount > 0 && (
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{filterCount}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Filter Panel ── */}
      {showFilter && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          style={{
            marginHorizontal: 20, marginBottom: 12,
            borderRadius: 16, padding: 14,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
          }}
        >
          {/* Muscle filter */}
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 2, marginBottom: 10 }}>
            กล้ามเนื้อ
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {muscleGroups.map(mg => {
                const isActive = activeFilter === mg.id;
                return (
                  <TouchableOpacity
                    key={mg.id}
                    onPress={() => setActiveFilter(isActive ? null : mg.id)}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                      backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.07)',
                      borderWidth: 1,
                      borderColor: isActive ? '#fff' : 'rgba(255,255,255,0.12)',
                    }}
                  >
                    {isActive
                      ? <View style={{ opacity: 1 }}>{
                          React.cloneElement(muscleIconMap[mg.id] as any, { color: '#000', size: 12 })
                        }</View>
                      : muscleIconMap[mg.id]
                    }
                    <Text style={{
                      color: isActive ? '#000' : 'rgba(255,255,255,0.7)',
                      fontSize: 11, fontWeight: isActive ? '700' : '500',
                    }}>
                      {mg.nameTh}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Difficulty filter */}
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 2, marginBottom: 10 }}>
            ระดับ
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map(d => {
              const isActive = activeDiff === d;
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => setActiveDiff(isActive ? null : d)}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                    backgroundColor: isActive
                      ? DIFFICULTY_COLOR[d].replace('0.15', '0.35')
                      : 'rgba(255,255,255,0.05)',
                    borderWidth: 1,
                    borderColor: isActive
                      ? DIFFICULTY_TEXT[d].replace('0.9', '0.6')
                      : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Text style={{
                    color: isActive ? DIFFICULTY_TEXT[d] : 'rgba(255,255,255,0.55)',
                    fontSize: 11, fontWeight: isActive ? '700' : '500',
                  }}>
                    {DIFFICULTY_TH[d]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Clear all */}
          {filterCount > 0 && (
            <TouchableOpacity
              onPress={() => { setActiveFilter(null); setActiveDiff(null); }}
              style={{ marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <X color="rgba(255,255,255,0.4)" size={12} />
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>ล้างตัวกรอง</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      {/* ── Quick Chips (muscle group pills always visible) ── */}
      {!showFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12 }}
          style={{ flexGrow: 0 }}
        >
          <TouchableOpacity
            onPress={() => setActiveFilter(null)}
            style={{
              paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
              backgroundColor: activeFilter === null ? '#fff' : 'rgba(255,255,255,0.07)',
              borderWidth: 1,
              borderColor: activeFilter === null ? '#fff' : 'rgba(255,255,255,0.12)',
            }}
          >
            <Text style={{
              color: activeFilter === null ? '#000' : 'rgba(255,255,255,0.65)',
              fontSize: 11, fontWeight: '700',
            }}>
              ทั้งหมด
            </Text>
          </TouchableOpacity>
          {muscleGroups.map(mg => {
            const isActive = activeFilter === mg.id;
            return (
              <TouchableOpacity
                key={mg.id}
                onPress={() => setActiveFilter(isActive ? null : mg.id)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
                  backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.07)',
                  borderWidth: 1,
                  borderColor: isActive ? '#fff' : 'rgba(255,255,255,0.12)',
                }}
              >
                <Text style={{
                  color: isActive ? '#000' : 'rgba(255,255,255,0.65)',
                  fontSize: 11, fontWeight: isActive ? '700' : '500',
                }}>
                  {mg.nameTh}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* ── Result Count ── */}
      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
          {filtered.length} ท่าออกกำลังกาย
        </Text>
      </View>

      {/* ── Results List ── */}
      {filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 120 }}>
          <Search color="rgba(255,255,255,0.1)" size={48} />
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: '600', marginTop: 16 }}>
            ไม่พบท่าออกกำลังกาย
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 6 }}>
            ลองค้นหาด้วยคำอื่น
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          renderItem={({ item, index }) => (
            <ExerciseCard
              item={item}
              index={index}
              onPress={() => navigation.navigate('ExerciseDetail', { id: item.id })}
            />
          )}
        />
      )}

      <BottomNav active="Search" />
    </View>
  );
}