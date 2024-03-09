import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { LeaveRequest } from "../../interface/LeaveRequest"; // Path to your LeaveRequest interface
import { RootState } from "../store";

interface LeaveRequestsState {
  leaveRequests: LeaveRequest[];
}

const initialState: LeaveRequestsState = {
  leaveRequests: [],
};

export function doesOverlap(
  existingRequests: LeaveRequest[],
  newRequest: LeaveRequest
): boolean {
  for (const existingRequest of existingRequests) {
    // Check for overlap based on start and end dates
    if (newRequest.selectedUser == existingRequest.selectedUser) {
      if (
        (newRequest.startDate < existingRequest.endDate &&
          newRequest.startDate >= existingRequest.startDate) ||
        (newRequest.endDate > existingRequest.startDate &&
          newRequest.endDate <= existingRequest.endDate) ||
        (newRequest.startDate <= existingRequest.startDate &&
          newRequest.endDate >= existingRequest.endDate)
      ) {
        return true;
      }
    }
  }
  return false;
}

export const addLeaveRequest = createAsyncThunk(
  "leaveRequests/addLeaveRequest",
  async (data: LeaveRequest, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const existingRequests = state.leaveRequests.leaveRequests;

      if (doesOverlap(existingRequests, data)) {
        // Throw custom error object directly
        throw new Error("Leave request overlaps with an existing one");
      }
      dispatch(addLeaveRequestToStore(data));
      return data;
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }
);

export const addLeaveRequestToStore = createAction<LeaveRequest>(
  "leaveRequests/addLeaveRequestToStore"
);

export const leaveRequestsSlice = createSlice({
  name: "leaveRequests",
  initialState,
  reducers: {}, // No reducers needed for async thunk actions
  extraReducers: (builder) => {
    builder
      .addCase(addLeaveRequest.fulfilled, (state, action) => {})
      .addCase(addLeaveRequest.rejected, (state, action) => {})
      .addCase(addLeaveRequestToStore, (state, action) => {
        state.leaveRequests.push(action.payload);
      });
  },
});

export default leaveRequestsSlice.reducer;
