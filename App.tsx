import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { initDatabase } from './src/database/taskRepository';
import { RootStackParamList } from './src/types/Navigation';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { TaskFormScreen } from './src/screens/TaskFormScreen';
import { TaskDetailScreen } from './src/screens/TaskDetailScreen';
import { colors } from './src/components/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch(err => {
        console.error('DB init error:', err);
        setDbError('Erro ao inicializar o banco de dados.');
      });
  }, []);

  if (!dbReady && !dbError) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.splashText}>Inicializando...</Text>
      </View>
    );
  }

  if (dbError) {
    return (
      <View style={styles.splash}>
        <Text style={styles.errorText}>{dbError}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TaskList" component={TaskListScreen} />
          <Stack.Screen
            name="TaskForm"
            component={TaskFormScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  splashText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
