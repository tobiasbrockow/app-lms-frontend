import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ViewState {
  page: "home" | "course" | "course-menu";
  editMode: boolean;
  moduleIndex: number | undefined;
  sectionIndex: number | undefined;
  nodeIndex: number | undefined;
  unsavedChanges: boolean;
  selectedText: { startI: number; endI: number } | null;
  completedTasks: boolean[];
  filter: string;
}

export interface ArticleViewIndexes {
  moduleIndex: number | undefined;
  sectionIndex: number | undefined;
  nodeIndex: number | undefined;
}

const initialState: ViewState = {
  page: "home",
  editMode: false,
  moduleIndex: 0,
  sectionIndex: 0,
  nodeIndex: 0,
  unsavedChanges: false,
  selectedText: null,
  completedTasks: [true],
  filter: "app-lms-nav-this-page",
};

export const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    changePage: (
      state,
      action: PayloadAction<"home" | "course" | "course-menu">
    ) => {
      state.page = action.payload;
    },
    updateViewIndex: (state, action: PayloadAction<ArticleViewIndexes>) => {
      state.nodeIndex = action.payload.nodeIndex;
      state.sectionIndex = action.payload.sectionIndex;
      state.moduleIndex = action.payload.moduleIndex;
    },
    changeEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    },
    setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.unsavedChanges = action.payload;
    },
    setSelectedText: (
      state,
      action: PayloadAction<{ startI: number; endI: number }>
    ) => {
      state.selectedText = action.payload;
    },
    removeSelectedText: (state) => {
      state.selectedText = null;
    },
    setCompletedTasks: (state, action: PayloadAction<boolean[]>) => {
      state.completedTasks = action.payload;
    },
    setTaskToComplete: (state, action: PayloadAction<number>) => {
      state.completedTasks[action.payload] = true;
    },
    changeFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  changePage,
  updateViewIndex,
  changeEditMode,
  setUnsavedChanges,
  setSelectedText,
  removeSelectedText,
  setCompletedTasks,
  setTaskToComplete,
  changeFilter,
} = viewSlice.actions;

export const selectView = (state: RootState) => state.view;
export const selectPage = (state: RootState) => state.view.page;
export const selectEditMode = (state: RootState) => state.view.editMode;
export const selectUnsavedChanges = (state: RootState) =>
  state.view.unsavedChanges;
export const getSelectedText = (state: RootState) => state.view.selectedText;
export const getCompletedTasks = (state: RootState) =>
  state.view.completedTasks;
export const selectFilter = (state: RootState) => state.view.filter;

export default viewSlice.reducer;
