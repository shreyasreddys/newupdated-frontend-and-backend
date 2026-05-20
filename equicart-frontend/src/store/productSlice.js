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

// Admin CRUD Thunks
export const addProduct = createAsyncThunk(
  'products/add',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', productData);
      return response.data; // created product
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add product.'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data; // updated product
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product.'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product.'
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
      // CREATE PRODUCT
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.stats.totalProducts += 1;
        if (state.activeCategory === 'All' || action.payload.category.toLowerCase() === state.activeCategory.toLowerCase()) {
          state.categoryItems.push(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        // also update categoryItems if present
        const cIdx = state.categoryItems.findIndex(p => p.id === action.payload.id);
        if (cIdx !== -1) {
          state.categoryItems[cIdx] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(p => p.id !== action.payload);
        state.categoryItems = state.categoryItems.filter(p => p.id !== action.payload);
        state.stats.totalProducts = Math.max(0, state.stats.totalProducts - 1);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
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
