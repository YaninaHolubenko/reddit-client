//selectedCategorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const selectedCategorySlice = createSlice({
  name: 'selectedCategory',
  initialState: 'popular',
  // This action will be called whenever the user selects a different category.
  // It receives the new category name as "action.payload" and just returns it.
  reducers: {
    setSelectedCategory(state, action) {
      return action.payload;
    },
  },
});

export const { setSelectedCategory } = selectedCategorySlice.actions;

export default selectedCategorySlice.reducer; 