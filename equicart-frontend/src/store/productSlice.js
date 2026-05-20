import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async Thunks
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products. Please try again later.'
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return { products: response.data, category };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to fetch products for ${category}.`
      );
    }
  }
);

export const fetchProductStats = createAsyncThunk(
  'products/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/stats');
      return response.data; // { totalProducts: X }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product stats.'
      );
    }
  }
);

// Initial State
const initialState = {
  items: [],
  categoryItems: [],
  activeCategory: 'All',
  loading: false,
  error: null,
  stats: {
    totalProducts: 0,
  },
};

// Slice definition
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
      if (action.payload === 'All') {
        state.categoryItems = state.items;
      } else {
        state.categoryItems = state.items.filter(
          item => item.category.toLowerCase() === action.payload.toLowerCase()
        );
      }
    },
    clearProductError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        if (state.activeCategory === 'All') {
          state.categoryItems = action.payload;
        } else {
          state.categoryItems = action.payload.filter(
            item => item.category.toLowerCase() === state.activeCategory.toLowerCase()
          );
        }
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // FETCH BY CATEGORY
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryItems = action.payload.products;
        state.activeCategory = action.payload.category;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // STATS
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.stats.totalProducts = action.payload.totalProducts;
      });
  },
});

export const { setActiveCategory, clearProductError } = productSlice.actions;
export default productSlice.reducer;
