# 🏋️‍♂️ FormFit

> A mobile fitness and workout tracking application featuring real-time camera form setup, built with React Native, Expo, and Tailwind CSS.

---

## 📦 Technologies

- React Native
- Expo
- TypeScript
- Tailwind CSS (NativeWind)
- Camera API / Vision
- Git & GitHub

---

## 🦄 Features

Here's what you can do with FormFit:

- **Workout Tracking:** Browse through various muscle groups and select exercises tailored to your fitness routine.
- **Camera Form Setup:** Use the device camera to monitor your posture and form during exercises to prevent injuries.
- **Interactive Workouts:** Follow step-by-step exercise guides with built-in timers and progress rings.
- **History & Summary:** Review your past workout sessions, exercise history, and overall fitness progress over time.
- **Clean UI & Dark Mode:** Enjoy a modern, user-friendly interface optimized for mobile screens.

---

## ⌨️ Navigation & Controls

Seamlessly move through the app:
- **Home / Muscle Selection:** Tap through different muscle groups to find targeted exercises.
- **Camera Setup:** Position your device and initialize the camera interface for form tracking.
- **Workout Execution:** Start, pause, and complete sets while tracking your performance.
- **History & Settings:** Access your logs and customize your profile preferences.

---

## 👨‍💻 The Process

I started by designing the user flow and structuring the mobile navigation using React Native and Expo. I focused on creating an intuitive UI with Tailwind CSS to ensure a clean aesthetic across different mobile screen sizes.

Next, I implemented the core workout screens, allowing users to browse through exercises (`MuscleScreen`, `ExerciseDetailScreen`, and `WorkoutScreen`). I integrated data structures to manage exercise lists and history logs seamlessly.

To tackle form checking, I set up the `CameraSetupScreen` to handle device camera permissions and preview layouts. I also built summary and history components (`SummaryScreen` and `HistoryScreen`) to give users clear feedback on their completed workouts.

Along the way, I documented challenges and solutions, focusing on state management, smooth screen transitions, and component reusability to ensure the app performs reliably on both iOS and Android.

---

## 🧠 What I Learned

During this project, I picked up important mobile development skills and improved my understanding of cross-platform application architecture:

- **React Native Navigation:** Gained deeper experience in configuring stack and bottom-tab navigators (`AppNavigator.tsx`, `BottomNav.tsx`).
- **Styling with Tailwind CSS:** Learned how to efficiently style mobile components using utility-first classes via NativeWind.
- **State Management & UI Feedback:** Implemented dynamic UI elements like progress rings (`ProgressRing.tsx`) and real-time workout summaries.
- **Camera Integration:** Handled mobile hardware permissions and camera view components for interactive features.

---

## 📈 How Can It Be Improved?

- Add AI-powered real-time pose estimation for automatic rep counting and form correction.
- Integrate local storage or a backend database (e.g., Firebase / Supabase) for cloud sync.
- Add custom workout routine creation features for users.
- Support more detailed graphical analytics for weight lifting progress.

---

## 🚦 Running the Project

To run the project in your local environment, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` or `yarn` in the project directory to install the required dependencies.
3. Run `npx expo start` to start the Expo development server.
4. Scan the QR code using the **Expo Go** app on your physical device, or run it on an Android/iOS emulator.

---

## 📺 App Demo

<video src="https://raw.githubusercontent.com/SurasakKanlayaluk/FROMFIT-APP/refs/heads/main/formfit-demo.mp4" width="100%" controls muted autoplay loop></video>
