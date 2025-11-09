import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSucceeded } from '../store/authSlice';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [emailErr, setEmailErr] = useState<string>('');
  const [passwordErr, setPasswordErr] = useState<string>('');

  const valid = useMemo(() => {
    let ok = true;
    if (!EMAIL_RE.test(email)) ok = false;
    if (password.length < 6) ok = false;
    return ok;
  }, [email, password]);

  const onSubmit = () => {
    // Validate and show errors if invalid
    setEmailErr(EMAIL_RE.test(email) ? '' : 'Please enter a valid email.');
    setPasswordErr(password.length >= 6 ? '' : 'Password must be at least 6 characters.');

    if (!valid) return;

    // On success — navigate to Home via Redux auth
    dispatch(loginSucceeded({ email }));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      {!!emailErr && <Text style={styles.err}>{emailErr}</Text>}

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {!!passwordErr && <Text style={styles.err}>{passwordErr}</Text>}

      <View style={{ height: 12 }} />
      <Button title="Login" onPress={onSubmit} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  err: { color: 'red', marginBottom: 8 }
});

export default LoginScreen;
