import { View, Text, StyleSheet } from 'react-native';
import {
  useNavigationStore,
  selectCurrentScreen,
} from '@ouiclair/core';

// Phase 2 shell: each screen renders a placeholder.
// Screens will be implemented in Phases 3–7.

export function RouteRenderer() {
  const screen = selectCurrentScreen(useNavigationStore.getState());

  return (
    <View style={styles.container}>
      <Text style={styles.text}>TODO: {screen}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'monospace',
  },
});
