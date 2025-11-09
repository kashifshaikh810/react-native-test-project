import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import Counter from '../components/Counter';
import { logout } from '../store/authSlice';
import { RootState } from '../store/store';

type User = { id: number; name: string; email: string };

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector((s: RootState) => s.auth.user?.email);
  const sessionKey = useSelector((s: RootState) => s.auth.sessionKey);

  const { isOnline } = useNetworkStatus();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setErrorMsg('');
      setLoading(true);
      const res = await fetch(USERS_URL);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as User[];
      setUsers(data);
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, sessionKey]); // sessionKey remounts Home after logout/login

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  }, [fetchUsers]);

  const header = useMemo(() => {
    if (isOnline === null) return null;
    return (
      <View style={[styles.statusBar, { backgroundColor: isOnline ? '#DFF6DD' : '#FCE8E6' }]}>
        <Text style={{ color: isOnline ? '#1E7E34' : '#A61B1B', fontWeight: '600' }}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    );
  }, [isOnline]);

  return (
    <View style={styles.container} key={sessionKey}>
      {header}

      <View style={styles.headerRow}>
        <Text style={styles.title}>Welcome{userEmail ? `, ${userEmail}` : ''}!</Text>
        <Button title="Logout" onPress={() => dispatch(logout())} />
      </View>

      <Counter />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

      {!!errorMsg && (
        <Text style={{ color: 'red', marginTop: 12 }} testID="error">
          {errorMsg}
        </Text>
      )}

      {!loading && !errorMsg && (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ marginTop: 16 }}>No users.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  statusBar: {
    padding: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB'
  },
  name: { fontWeight: '600', fontSize: 16 },
  email: { color: '#6B7280', marginTop: 2 }
});

export default HomeScreen;
