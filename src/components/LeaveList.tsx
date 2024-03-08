import "../styles/LeaveList.css";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import LeaveRequestForm from "./LeaveRequestForm";

interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  // example leave requests
  {
    id: 1,
    startDate: "2024-03-07",
    endDate: "2024-03-09",
    leaveType: "Personal",
    reason: "Doctor appointment",
  },
  {
    id: 2,
    startDate: "2024-03-12",
    endDate: "2024-03-14",
    leaveType: "Sick",
    reason: "Feeling unwell",
  },
];

const LeaveList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  const handleFormSubmit = (data: LeaveRequest) => {
    // Handle form submission logic here (e.g., call an API)
    console.log("Form submitted:", data);
    setIsModalOpen(false); // Close the modal after successful submission
  };

  return (
    <div className="leave-list">
      <h2>Current Leave Requests</h2>
      {mockLeaveRequests.length > 0 ? (
        <ul>
          {mockLeaveRequests.map((leaveRequest) => (
            <li key={leaveRequest.id}>
              <span>Start Date: {leaveRequest.startDate}</span>
              <span>End Date: {leaveRequest.endDate}</span>
              <span>Leave Type: {leaveRequest.leaveType}</span>
              <span>Reason: {leaveRequest.reason}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No leave requests found.</p>
      )}

      <button onClick={toggleModal}>Add New Leave Request</button>
      <ReactModal isOpen={isModalOpen} onRequestClose={toggleModal}>
        <LeaveRequestForm onSubmit={handleFormSubmit} />
      </ReactModal>
    </div>
  );
};

export default LeaveList;
