export interface LeaveRequest {
  requestId: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  selectedUserId: number;
  selectedUser: string;
  numberOfDays?: number;
}
