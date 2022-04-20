import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { CourseState } from "../course/courseSlice";

export interface CoursesState extends Array<CourseState> {}

export const initialState: CoursesState = [];

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse: (state, action: PayloadAction<CourseState>) => {
      const duplicate = state.find((c) => c.id === action.payload.id);
      if (duplicate === undefined) {
        state.push(action.payload);
      }
    },
    addAllCourses: (state, action: PayloadAction<CoursesState>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCourseAsync.pending, (state) => {})
      .addCase(
        addCourseAsync.fulfilled,
        (state, action: PayloadAction<CourseState>) => {
          state.push(action.payload);
        }
      )
      .addCase(
        deleteCourseAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          return state.filter((c) => c.id !== parseInt(action.payload));
        }
      );
  },
});

export const addCourseAsync = createAsyncThunk(
  "course/addCourse",
  async (course: CourseState) => {
    const response: CourseState = await fetch(
      "https://applmsbe.herokuapp.com/courses/add",
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: course.title,
          des: course.des,
          url: course.url,
          img_src: course.img_src,
        }),
      }
    ).then((response) => response.json());
    return response;
  }
);

export const deleteCourseAsync = createAsyncThunk(
  "course/deleteCourse",
  async (courseId: string) => {
    const response: string = await fetch(
      "https://applmsbe.herokuapp.com/courses/" + courseId,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return response;
  }
);

export const { addCourse, addAllCourses } = coursesSlice.actions;

export const selectCourses = (state: RootState) => state.courses;

export default coursesSlice.reducer;
