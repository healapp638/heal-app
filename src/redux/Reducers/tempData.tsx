import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TempDataState {
  loader: boolean;
  conversationId: any;
  moduleTheme: any;
  moduleSubModule: any;
  modulePhase: any;
  moduleIsLastPhase: boolean;
  moduleSource: string | null;
  challengesActiveTab: 'daily' | 'weekly';
  exerciseJustCompleted: boolean;
  challengeJustCompleted: boolean;
}

const initialState: TempDataState = {
  loader: false,
  conversationId: null,
  moduleTheme: null,
  moduleSubModule: null,
  modulePhase: null,
  moduleIsLastPhase: false,
  moduleSource: null,
  challengesActiveTab: 'daily',
  exerciseJustCompleted: false,
  challengeJustCompleted: false,
};

const tempDataSlice = createSlice({
  name: 'tempData',
  initialState,
  reducers: {
    setLoader: (state, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
    setConversationId: (state, action: PayloadAction<string | null>) => {
      state.conversationId = action.payload;
    },
    setModuleTheme: (state, action: PayloadAction<any>) => {
      state.moduleTheme = action.payload;
    },
    setModuleSubModule: (state, action: PayloadAction<any>) => {
      state.moduleSubModule = action.payload;
    },
    setModulePhase: (state, action: PayloadAction<any>) => {
      state.modulePhase = action.payload;
    },
    setModuleIsLastPhase: (state, action: PayloadAction<boolean>) => {
      state.moduleIsLastPhase = action.payload;
    },
    setModuleSource: (state, action: PayloadAction<string | null>) => {
      state.moduleSource = action.payload;
    },
    setChallengesActiveTab: (state, action: PayloadAction<'daily' | 'weekly'>) => {
      state.challengesActiveTab = action.payload;
    },
    setExerciseJustCompleted: (state, action: PayloadAction<boolean>) => {
      state.exerciseJustCompleted = action.payload;
    },
    setChallengeJustCompleted: (state, action: PayloadAction<boolean>) => {
      state.challengeJustCompleted = action.payload;
    },
    clearModuleParams: (state) => {
      state.moduleTheme = null;
      state.moduleSubModule = null;
      state.modulePhase = null;
      state.moduleIsLastPhase = false;
      state.moduleSource = null;
      state.challengesActiveTab = 'daily';
      state.exerciseJustCompleted = false;
      state.challengeJustCompleted = false;
    },
  },
});

export const {
  setLoader,
  setConversationId,
  setModuleTheme,
  setModuleSubModule,
  setModulePhase,
  setModuleIsLastPhase,
  setModuleSource,
  setChallengesActiveTab,
  setExerciseJustCompleted,
  setChallengeJustCompleted,
  clearModuleParams,
} = tempDataSlice.actions;

export default tempDataSlice.reducer;
