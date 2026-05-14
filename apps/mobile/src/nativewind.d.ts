import 'react-native';
import 'expo-blur';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface PressableProps {
    className?: string;
  }
}

declare module 'expo-blur' {
  interface BlurViewProps {
    className?: string;
  }
}
