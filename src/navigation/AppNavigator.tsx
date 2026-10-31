import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen }         from '../screens/LoginScreen';
import { HomeScreen }          from '../screens/HomeScreen';
import { MuscleScreen }        from '../screens/MuscleScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { CameraSetupScreen }   from '../screens/CameraSetupScreen';
import { WorkoutScreen }       from '../screens/WorkoutScreen';
import { SummaryScreen }       from '../screens/SummaryScreen';
import { SettingsScreen }      from '../screens/SettingsScreen';
import { SearchScreen }        from '../screens/SearchScreen';
import { HistoryScreen }       from '../screens/HistoryScreen';

// Debug: ตรวจสอบว่า import ถูกต้อง
console.log('CameraSetupScreen import check:', typeof CameraSetupScreen, CameraSetupScreen?.displayName || 'no displayName');

export type SetData = { reps: number; score: number };

export type RootStackParamList = {
  Login:          undefined;
  Home:           undefined;
  Muscle:         { id: string };
  ExerciseDetail: { id: string };
  CameraSetup:    { id: string };
  Workout:        { id: string };
  Summary: {
    exerciseId:     string;
    exerciseName:   string;
    exerciseNameEn: string;
    totalReps:      number;
    completedSets:  number;
    avgFormScore:   number;
    duration:       number;
    caloriesBurned: number;
    muscles:        string[];
    setData:        SetData[];
  };
  Settings: undefined;
  Search:   undefined;
  History:  undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login"          component={LoginScreen} />
        <Stack.Screen name="Home"           component={HomeScreen} />
        <Stack.Screen name="Muscle"         component={MuscleScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        <Stack.Screen name="CameraSetup"    component={CameraSetupScreen} />
        <Stack.Screen name="Workout"        component={WorkoutScreen}
          options={{ animation: 'fade' }} />
        <Stack.Screen name="Summary"        component={SummaryScreen}
          options={{ animation: 'fade' }} />
        <Stack.Screen name="Settings"       component={SettingsScreen} />
        <Stack.Screen name="Search"         component={SearchScreen} />
        <Stack.Screen name="History"        component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
