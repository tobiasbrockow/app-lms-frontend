import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface UserState {
  loggedIn: boolean;
  user: User | undefined;
}

export interface User {
  name: string;
  email: string;
  courses: CourseUser[];
}

interface CourseUser {
  id: number;
  completed: boolean;
}

const initialState: UserState = {
  loggedIn: false,
  user: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      if (
        action.payload.email != undefined &&
        action.payload.name != undefined
      ) {
        state.loggedIn = true;
        state.user = action.payload;
      }
    },
    logoutUser: (state) => {
      return initialState;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
