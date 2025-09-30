import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";


// Fetch tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
    try {
        const res = await API.get("/tasks/get");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Add task
export const addTask = createAsyncThunk("tasks/addTask", async (title, { rejectWithValue }) => {
    try {
        const res = await API.post("/tasks/create", { title });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Update task status
export const toggleTaskStatus = createAsyncThunk("tasks/toggleTaskStatus", async (id, { rejectWithValue }) => {
    try {
        const res = await API.patch(`/tasks/update/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Delete task
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, { rejectWithValue }) => {
    try {
        await API.delete(`/tasks/delete/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const initialState = { 
  tasks: [], 
  loading: false, 
  error: null,
  operationLoading: false 
};


const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        optimisticToggle: (state, action) => {
            const task = state.tasks.find(t => t._id === action.payload);
            if (task) {
                task.status = task.status === "Pending" ? "Completed" : "Pending";
            }
        },
        optimisticDelete: (state, action) => {
            state.tasks = state.tasks.filter(t => t._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => { 
                state.tasks = action.payload; 
                state.loading = false; 
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch tasks";
            })
            
            // Add Task
            .addCase(addTask.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => { 
                state.tasks.push(action.payload);
                state.operationLoading = false;
            })
            .addCase(addTask.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload?.message || "Failed to add task";
            })
            
            // Toggle Task Status
            .addCase(toggleTaskStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(toggleTaskStatus.fulfilled, (state, action) => {
                const idx = state.tasks.findIndex(t => t._id === action.payload._id);
                if (idx >= 0) state.tasks[idx] = action.payload;
                state.operationLoading = false;
            })
            .addCase(toggleTaskStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload?.message || "Failed to update task";
            })
            
            // Delete Task
            .addCase(deleteTask.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(t => t._id !== action.payload);
                state.operationLoading = false;
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload?.message || "Failed to delete task";
            });
    },
});

export const { optimisticToggle, optimisticDelete } = taskSlice.actions;
export default taskSlice.reducer;