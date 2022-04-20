import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import viewReducer from "../features/view/viewSlice";
import courseReducer from "../features/course/courseSlice";
import coursesReducer from "../features/courses/coursesSlice";
import articleReducer from "../features/article/articleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    view: viewReducer,
    course: courseReducer,
    article: articleReducer,
    courses: coursesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
