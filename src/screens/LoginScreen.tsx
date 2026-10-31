import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Activity, Eye, EyeOff, ArrowRight, Fingerprint } from 'lucide-react-native';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [tab, setTab]             = useState<'login' | 'signup'>('login');

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home');
    }, 1400);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#000' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Logo ── */}
        <Animated.View
          entering={FadeInUp.duration(700)}
          style={{ alignItems: 'center', paddingTop: 80, paddingBottom: 32 }}
        >
          <View
            style={{
              width: 64, height: 64, backgroundColor: '#fff',
              borderRadius: 16, alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Activity color="#000" size={36} strokeWidth={2.5} />
          </View>
          <Text style={{ color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 20, letterSpacing: -1 }}>
            FormFit
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 4, letterSpacing: 4 }}>
            AI FITNESS ASSISTANT
          </Text>
        </Animated.View>

        {/* ── Card ── */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(250)}
          style={{
            marginHorizontal: 20,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: 24, overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <View
            style={{
              flexDirection: 'row', padding: 8, gap: 4,
              borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
            }}
          >
            {(['login', 'signup'] as const).map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                style={{
                  flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center',
                  backgroundColor: tab === t ? '#fff' : 'transparent',
                }}
              >
                <Text style={{
                  color: tab === t ? '#000' : 'rgba(255,255,255,0.4)',
                  fontSize: 12, fontWeight: '700', letterSpacing: 1,
                }}>
                  {t === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ padding: 24, gap: 16 }}>
            {/* Name field (signup only) */}
            {tab === 'signup' && (
              <View>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
                  ชื่อ-นามสกุล
                </Text>
                <TextInput
                  placeholder="Alex Johnson"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
                    color: '#fff', fontSize: 15,
                  }}
                />
              </View>
            )}

            {/* Email */}
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
                อีเมล
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="alex@formfit.ai"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
                  color: '#fff', fontSize: 15,
                }}
              />
            </View>

            {/* Password */}
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
                รหัสผ่าน
              </Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry={!showPass}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
                    paddingRight: 48, color: '#fff', fontSize: 15,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 16, top: 15 }}
                >
                  {showPass
                    ? <EyeOff color="rgba(255,255,255,0.35)" size={18} />
                    : <Eye   color="rgba(255,255,255,0.35)" size={18} />
                  }
                </TouchableOpacity>
              </View>
            </View>

            {tab === 'login' && (
              <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>ลืมรหัสผ่าน?</Text>
              </TouchableOpacity>
            )}

            {/* Primary CTA */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 10, marginTop: 4,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Text style={{ color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 2 }}>
                    {tab === 'login' ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
                  </Text>
                  <ArrowRight color="#000" size={16} />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 2 }}>หรือ</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            </View>

            {/* Social Buttons */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Apple */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 6, paddingVertical: 14, borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                {/* Apple icon SVG approximation */}
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}></Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' }}>Apple</Text>
              </TouchableOpacity>
              {/* Google */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 6, paddingVertical: 14, borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>G</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' }}>Google</Text>
              </TouchableOpacity>
              {/* FaceID */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 6, paddingVertical: 14, borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <Fingerprint color="rgba(255,255,255,0.7)" size={16} />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' }}>FaceID</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Bottom note */}
        <Text style={{
          color: 'rgba(255,255,255,0.25)', fontSize: 11,
          textAlign: 'center', marginTop: 24, paddingHorizontal: 20,
        }}>
          ด้วยการเข้าสู่ระบบ คุณยอมรับ{' '}
          <Text style={{ color: 'rgba(255,255,255,0.5)', textDecorationLine: 'underline' }}>
            นโยบายความเป็นส่วนตัว
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
