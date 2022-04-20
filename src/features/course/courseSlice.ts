import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface CourseState {
  active: boolean;
  id?: number;
  title?: string;
  img_src?: string;
  des?: string;
  url?: string;
  time_created?: string;
  time_lastchanged?: string;
  modules?: ModuleState[];
}

export interface ModuleState {
  id: number;
  title: string;
  completed: boolean;
  completed_percentage: number;
  sections?: SectionState[];
}

export interface SectionState {
  id: number;
  title: string;
  completed: boolean;
  articles?: ArticleState[];
}

export interface ArticleState {
  id: number;
  title: string;
  completed: boolean;
}

const initialState: CourseState = {
  active: false,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    changeCourse: (state, action: PayloadAction<CourseState>) => {
      return action.payload;
    },
    deleteCourse: (state) => {
      return initialState;
    },
    addfirstModule: (state) => {
      state.modules = [
        {
          title: "",
          id: Math.floor(Math.random() * 90000) + 10000,
          completed: false,
          completed_percentage: 0,
          sections: [
            {
              id: Math.floor(Math.random() * 90000) + 10000,
              title: "",
              completed: false,
              articles: [
                {
                  id: Math.floor(Math.random() * 90000) + 10000,
                  title: "",
                  completed: false,
                },
              ],
            },
          ],
        },
      ];
    },
    addEmptyModule: (state) => {
      state.modules?.push({
        title: "",
        id: Math.floor(Math.random() * 90000) + 10000,
        completed: false,
        completed_percentage: 0,
        sections: [
          {
            id: Math.floor(Math.random() * 90000) + 10000,
            title: "",
            completed: false,
            articles: [
              {
                id: Math.floor(Math.random() * 90000) + 10000,
                title: "",
                completed: false,
              },
            ],
          },
        ],
      });
    },
    changeModuleTitle: (
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) => {
      state.modules?.forEach((m) => {
        if (m.id === action.payload.id) {
          m.title = action.payload.title;
        }
      });
    },
    changeSectionTitle: (
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) => {
      state.modules?.forEach((m) => {
        m.sections?.forEach((s) => {
          if (s.id === action.payload.id) {
            s.title = action.payload.title;
          }
        });
      });
    },
    changeArticleTitle: (
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) => {
      state.modules?.forEach((m) => {
        m.sections?.forEach((s) => {
          s.articles?.forEach((a) => {
            if (a.id === action.payload.id) {
              a.title = action.payload.title;
            }
          });
        });
      });
    },
    deleteModule: (state, action: PayloadAction<number>) => {
      state.modules = state.modules?.filter((m) => m.id !== action.payload);
    },
    deleteSection: (state, action: PayloadAction<number>) => {
      state.modules?.forEach((m) => {
        m.sections = m.sections?.filter((s) => s.id !== action.payload);
      });
    },
    deleteArticle: (state, action: PayloadAction<number>) => {
      state.modules?.forEach((m) => {
        m.sections?.forEach((s) => {
          s.articles = s.articles?.filter((a) => a.id !== action.payload);
        });
      });
    },
    addSection: (state, action: PayloadAction<number>) => {
      state.modules?.forEach((m) => {
        if (m.id === action.payload) {
          m.sections?.push({
            id: Math.floor(Math.random() * 90000) + 10000,
            title: "",
            completed: false,
            articles: [
              {
                id: Math.floor(Math.random() * 90000) + 10000,
                title: "",
                completed: false,
              },
            ],
          });
        }
      });
    },
    addArticle: (state, action: PayloadAction<number>) => {
      state.modules?.forEach((m) => {
        m.sections?.forEach((s) => {
          if (s.id === action.payload) {
            s.articles?.push({
              id: Math.floor(Math.random() * 90000) + 10000,
              title: "",
              completed: false,
            });
          }
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseAsync.pending, (state) => {
        state.active = false;
      })
      .addCase(
        fetchCourseAsync.fulfilled,
        (state, action: PayloadAction<CourseState>) => {
          return action.payload;
        }
      );
  },
});

export const fetchCourseAsync = createAsyncThunk(
  "course/fetchCourse",
  async (path: string) => {
    const response: CourseState = await fetch(
      "https://applmsbe.herokuapp.com/courses/" + path,
      { method: "GET", credentials: "include" }
    ).then((response) => response.json());
    return response;
  }
);

export const changeCourseAsync = createAsyncThunk(
  "course/updateCourse",
  async (course: CourseState) => {
    const response: CourseState = await fetch(
      "https://applmsbe.herokuapp.com/courses/" + course.id?.toString(),
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      }
    ).then((response) => response.json());
    return response;
  }
);

export const {
  changeCourse,
  deleteCourse,
  addfirstModule,
  addEmptyModule,
  changeModuleTitle,
  changeSectionTitle,
  changeArticleTitle,
  deleteModule,
  deleteSection,
  deleteArticle,
  addSection,
  addArticle,
} = courseSlice.actions;

export const selectCourses = (state: RootState) => state.course;
export const selectCourse = (state: RootState) => state.course;
export const selectCourseId = (state: RootState) => state.course.id;

export default courseSlice.reducer;
