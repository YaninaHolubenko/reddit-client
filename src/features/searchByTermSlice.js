// searchByTermSlice.js
import { createSlice } from '@reduxjs/toolkit';

const searchByTermSlice = createSlice({
  name: 'searchByTerm',
  initialState: '',
  reducers: {
    setSearchTerm: (state, action) => action.payload,
    clearSearchTerm: () => '',
  },
});

export const { setSearchTerm, clearSearchTerm } = searchByTermSlice.actions;
export const searchByTermReducer = searchByTermSlice.reducer; // Экспорт редюсера

export default searchByTermReducer;