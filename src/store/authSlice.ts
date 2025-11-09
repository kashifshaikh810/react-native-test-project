import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
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
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessionKey += 1;
    }
  }
});

export const { loginSucceeded, logout } = authSlice.actions;
export default authSlice.reducer;
