import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiService } from '@/services/apiService'
import { errorHandler } from '@/lib/errorHandler'

// Define the user interface based on your API response
export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
}

// Async thunk to fetch user data
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<User>('/api/v1/auth/me')
      if (response.status === 200 && response.data) {
        return response.data
      } else if (response.status === 401) {
        // Handle authentication errors
        errorHandler.handleAuthError('Authentication failed while fetching profile', {
          customMessage: 'Please log in again to continue.',
          redirectToAuth: true
        })
        return rejectWithValue('Authentication failed')
      } else {
        // Handle other API errors
        const errorMessage = response.error || 'Failed to fetch user profile'
        errorHandler.handleGenericError(errorMessage, {
          customMessage: 'Unable to load profile information. Please try again.'
        })
        return rejectWithValue(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      errorHandler.handleNetworkError(errorMessage, {
        customMessage: 'Network error while loading profile. Please check your connection.'
      })
      return rejectWithValue(errorMessage)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null
      state.error = null
      state.loading = false
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.error = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        // Only set loading to true if we don't already have user data
        if (!state.user) {
          state.loading = true
        }
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearUser, setUser } = userSlice.actions
export default userSlice.reducer