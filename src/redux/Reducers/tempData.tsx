import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TempDataState {
  loader: boolean;
  conversationId: string;
}

const initialState: TempDataState = {
  loader: false,
  conversationId: '',
};

const tempDataSlice = createSlice({
  name: 'tempData',
  initialState,
  reducers: {
    setLoader: (state, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
    setConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },
  },
});

export const { setLoader, setConversationId } = tempDataSlice.actions;

export default tempDataSlice.reducer;
