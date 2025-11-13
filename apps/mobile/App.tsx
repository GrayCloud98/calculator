import React from 'react';
import { View, Text, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { evaluate, formatOperand } from '@calc/shared';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const result = evaluate("1", "2", "+");
  const formatted = formatOperand(result);

  console.log("Shared evaluate:", result);
  console.log("Shared formatted:", formatted);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Calculator (Mobile)</Text>
          <Text style={styles.subtitle}>
            evaluate(1,2,+) = {result}
          </Text>
          <Text style={styles.subtitle}>
            formatted = {formatted}
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
  },
});

export default App;
