import { configureStore } from "@reduxjs/toolkit";
import leaveRequestsReducer from "./slices/leaveRequestSlice";
import { preloadedState } from "../store/preloadedState";

export const store = configureStore({
  reducer: {
    leaveRequests: leaveRequestsReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
