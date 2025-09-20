import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiService } from '@/services/apiService'
import { errorHandler } from '@/lib/errorHandler'

export interface Workspace {
  id: string
  name: string
  domain: string
  visible_to_org: boolean
  created_at: string
  updated_at: string
}

interface WorkspaceState {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  loading: boolean
  error: string | null
  createLoading: boolean
  createError: string | null
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
}

export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getWorkspaces()
      if (response.status === 200 && response.data) {
        return response.data
      } else if (response.status === 401) {
        errorHandler.handleAuthError('Authentication failed while fetching workspaces', {
          customMessage: 'Please log in again to continue.',
          redirectToAuth: true
        })
        return rejectWithValue('Authentication failed')
      } else {
        const errorMessage = response.error || 'Failed to fetch workspaces'
        errorHandler.handleGenericError(errorMessage, {
          customMessage: 'Unable to load workspaces. Please try again.'
        })
        return rejectWithValue(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      errorHandler.handleNetworkError(errorMessage, {
        customMessage: 'Network error while loading workspaces. Please check your connection.'
      })
      return rejectWithValue(errorMessage)
    }
  }
)

export const createWorkspace = createAsyncThunk(
  'workspace/createWorkspace',
  async (workspaceData: { name: string; domain: string; visible_to_org: boolean }, { rejectWithValue }) => {
    try {
      const response = await apiService.createWorkspace(workspaceData)
      console.log('Workspace creation response:', { status: response.status, data: response.data, error: response.error })

      if ((response.status === 200 || response.status === 201) && response.data) {
        return response.data
      } else if (response.status === 401) {
        errorHandler.handleAuthError('Authentication failed while creating workspace', {
          customMessage: 'Please log in again to continue.',
          redirectToAuth: true
        })
        return rejectWithValue('Authentication failed')
      } else {
        const errorMessage = response.error || `Failed to create workspace (Status: ${response.status})`
        console.error('Workspace creation failed:', { status: response.status, error: response.error, data: response.data })
        return rejectWithValue(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      errorHandler.handleNetworkError(errorMessage, {
        customMessage: 'Network error while creating workspace. Please check your connection.'
      })
      return rejectWithValue(errorMessage)
    }
  }
)

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    clearWorkspaces: (state) => {
      state.workspaces = []
      state.currentWorkspace = null
      state.error = null
      state.loading = false
      state.createError = null
      state.createLoading = false
    },
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload
    },
    clearCreateError: (state) => {
      state.createError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workspaces
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false
        state.workspaces = action.payload
        state.error = null
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create workspace
      .addCase(createWorkspace.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.createLoading = false
        state.workspaces.push(action.payload)
        state.createError = null
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload as string
      })
  },
})

export const { clearWorkspaces, setCurrentWorkspace, clearCreateError } = workspaceSlice.actions
export default workspaceSlice.reducer