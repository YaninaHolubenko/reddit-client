//selectedCategorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const selectedCategorySlice = createSlice({
  name: 'selectedCategory',
  initialState: 'popular',
  reducers: {
    setSelectedCategory(state, action) {
      return action.payload;
    },
  },
});

export const { setSelectedCategory } = selectedCategorySlice.actions;

export default selectedCategorySlice.reducer;