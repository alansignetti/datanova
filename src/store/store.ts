import { configureStore } from "@reduxjs/toolkit";
import leaveRequestsReducer from "./slices/leaveRequestSlice";

export const store = configureStore({
  reducer: {
    leaveRequests: leaveRequestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
