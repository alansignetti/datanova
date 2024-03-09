export interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  selectedUser: string;
  numberOfDays?: number;
}
