import { configureStore } from "@reduxjs/toolkit";
import leaveRequestsReducer from "./slices/leaveRequestSlice";
import { preloadedState } from "../store/preloadedState";
const users = [
  { id: 0, name: "-- Please Select User --" },
  { id: 1, name: "Alan Signetti" },
  { id: 2, name: "Dale Pienaar" },
  { id: 3, name: "Joshua O'Dea" },
  { id: 4, name: "Antony Puckey" },
  { id: 5, name: "Mock 5" },
  { id: 6, name: "Mock 6" },
  { id: 7, name: "Mock 7" },
  { id: 8, name: "Mock 8" },
  { id: 9, name: "Mock 9" },
  { id: 10, name: "Mock 10" },
];
export const store = configureStore({
  reducer: {
    leaveRequests: leaveRequestsReducer,
  },
  preloadedState,
});

const leaveRequests = store.getState().leaveRequests.leaveRequests;
leaveRequests.forEach((request) => {
  const foundUser = users.find((user) => user.id === request.selectedUserId);
  if (foundUser) {
    request.selectedUser = foundUser.name;
    request.selectedUserId = foundUser.id;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
