import React, { useReducer } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Action = { type: 'inc' } | { type: 'dec' } | { type: 'reset' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'inc':
      return state + 1;
    case 'dec':
      return Math.max(0, state - 1);
    case 'reset':
      return 0;
    default:
      return state;
  }
}

/**
 * Local counter using useReducer.
 * This will naturally reset on unmount.
 * Additionally, we force-unmount Home on logout via sessionKey flip.
 */
const Counter = () => {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter (useReducer): {count}</Text>
      <View style={styles.row}>
        <Button title="Increment" onPress={() => dispatch({ type: 'inc' })} />
        <View style={{ width: 8 }} />
        <Button title="Decrement" onPress={() => dispatch({ type: 'dec' })} />
        <View style={{ width: 8 }} />
        <Button title="Reset" onPress={() => dispatch({ type: 'reset' })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  title: { fontWeight: '600', fontSize: 16, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' }
});

export default Counter;
