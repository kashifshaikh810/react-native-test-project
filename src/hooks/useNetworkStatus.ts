import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

/**
 * Custom hook that returns { isOnline, type }
 * - Shows "Online" when connected and "Offline" when disconnected
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
      setType(state.type);
    });

    // Fetch once initially
    NetInfo.fetch().then((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
      setType(state.type);
    });

    return unsubscribe;
  }, []);

  return { isOnline, type };
};
