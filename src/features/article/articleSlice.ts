import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ArticleState {
  active: boolean;
  loading: boolean;
  content?: ArticleContentState;
}

export interface ArticleContentState {
  id: number;
  courseId: number;
  title: string;
  node: NodeState;
  instruction?: InstructionState;
}

export interface NodeState {
  paragraphs: ParagraphState[];
}

export interface ParagraphState {
  paragraphType: "text" | "image" | "list";
  content: ParagraphContentState[];
}

export interface ParagraphContentState {
  type?: "textSpan" | "listItem" | "image";
  value?: string;
  format?: "bold" | "underline" | "italic";
  selector?: NodeSelector;
  image?: ImageState;
  listSpans?: ParagraphContentState[];
}

export interface NodeSelector {
  selector: string;
  index: number;
}

export interface ImageState {
  src: string;
  alt: string;
}

export interface InstructionState {
  tasks?: TaskState[];
}

export interface TaskState {
  title: string;
  description: string;
  completed: boolean;
  requirement: "element-visible" | "click";
  selector?: NodeSelector;
}

const initialState: ArticleState = {
  active: false,
  loading: false,
};

export const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    changeArticle: (state, action: PayloadAction<ArticleState>) => {
      return action.payload;
    },
    changeSpan: (
      state,
      action: PayloadAction<{ text: string; pI: number; sI: number }>
    ) => {
      state.content!.node.paragraphs[action.payload.pI].content[
        action.payload.sI
      ].value! = action.payload.text;
    },
    addParagraph: (state, action: PayloadAction<number>) => {
      state.content!.node.paragraphs.splice(action.payload + 1, 0, {
        paragraphType: "text",
        content: [
          {
            type: "textSpan",
            value: "",
          },
        ],
      });
    },
    deleteParagraph: (state, action: PayloadAction<number>) => {
      state.content!.node.paragraphs.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticleAsync.pending, (state) => {
        state.active = false;
        state.loading = true;
      })
      .addCase(
        fetchArticleAsync.fulfilled,
        (state, action: PayloadAction<ArticleState>) => {
          state.loading = false;
          state.active = true;
          state.content = action.payload.content;
        }
      )
      .addCase(fetchArticleAsync.rejected, (state) => {
        state.active = false;
        state.loading = false;
      });
  },
});

export const fetchArticleAsync = createAsyncThunk(
  "node/fetchArticle",
  async (path: string) => {
    const response = await fetch(
      "https://applmsbe.herokuapp.com/courses/" + path,
      {
        method: "GET",
        credentials: "include",
      }
    ).then((response) => response.json());
    return response;
  }
);

export const changeArticleAsync = createAsyncThunk(
  "article/updateArticle",
  async (article: ArticleState) => {
    const response: ArticleState = await fetch(
      "https://applmsbe.herokuapp.com/articles/" +
        article.content?.id?.toString(),
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      }
    ).then((response) => response.json());
    return response;
  }
);

export const { changeArticle, changeSpan, addParagraph, deleteParagraph } =
  articleSlice.actions;

export const selectArticle = (state: RootState) => state.article;

export default articleSlice.reducer;
