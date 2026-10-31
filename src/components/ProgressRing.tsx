import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  value?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  label,
  value,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        {value && (
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{value}</Text>
        )}
        {label && (
          <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>
            {label.toUpperCase()}
          </Text>
        )}
      </View>
    </View>
  );
}
