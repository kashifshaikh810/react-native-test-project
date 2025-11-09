import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  // A simple key to force-remount Home (so the local counter resets on logout)
  sessionKey: number;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessionKey: 0
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSucceeded: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      // Keep sessionKey same on login
    },
    logout: (state) => {
      // Reset everything
      state.isAuthenticated = false;
      state.user = null;
      state.sessionKey += 1; // flips the key so Home unmounts -> counter resets
    }
  }
});

export const { loginSucceeded, logout } = authSlice.actions;
export default authSlice.reducer;
