import "../styles/LeaveList.css";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import LeaveRequestForm from "./LeaveRequestForm";
import { LeaveRequest } from "../interface/LeaveRequest";
import { useSelector, useDispatch } from "react-redux";
import { addLeaveRequest } from "../store/slices/leaveRequestSlice";
import { updateLeaveRequest } from "../store/slices/leaveRequestSlice";
import { AppDispatch, RootState } from "../store/store";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const LeaveList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [editingLeaveRequest, setEditingLeaveRequest] =
    useState<LeaveRequest | null>(null);

  const leaveRequests: LeaveRequest[] = useSelector<RootState>(
    (state) => state.leaveRequests.leaveRequests
  ) as LeaveRequest[];

  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  const dispatch = useDispatch<AppDispatch>();

  const toggleModal = () => {
    setIsEditing(false);
    setEditingLeaveRequest(null);
    setIsModalOpen(!isModalOpen);
  };

  const handleEditRequest = (leaveRequest: LeaveRequest) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditingLeaveRequest(leaveRequest);
  };

  const handleFormSubmit = async (data: LeaveRequest) => {
    try {
      const response: any = await dispatch(addLeaveRequest(data));
      if (response.payload) {
        toast.success("Leave request submitted successfully!", {
          position: "top-right",
        });
        setIsModalOpen(false);
      } else {
        // Error
        console.error("Error:", response);
        const errorMessage: string = response.error.message;
        toast.error(errorMessage, {
          position: "top-right",
        });
      }
    } catch (error) {
      // Additional error handling for unexpected issues
      toast.error("An unexpected error occurred. Please try again later.", {
        position: "top-right",
      });
    }
  };

  const handleEditSubmit = async (data: LeaveRequest) => {
    try {
      const response: any = await dispatch(updateLeaveRequest(data));

      if (response.payload) {
        // Success
        toast.success("Leave request edited successfully!", {
          position: "top-right",
        });
        setIsModalOpen(false);
      } else {
        // Error
        console.error("Error:", response);
        const errorMessage: string = response.error.message;
        toast.error(errorMessage, {
          position: "top-right",
        });
      }
    } catch (error) {
      // Additional error handling for unexpected issues
      console.log(error);
      toast.error("An unexpected error occurred. Please try again later.", {
        position: "top-right",
      });
    }
  };

  const [page, setPage] = useState(0); // Page state for pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filteredLeaveRequests = leaveRequests
    .filter((leaveRequest) => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const startDate = startDateFilter ? new Date(startDateFilter) : null;
      const endDate = endDateFilter ? new Date(endDateFilter) : null;

      const isStartDateMatch =
        !startDate ||
        new Date(leaveRequest.startDate).getTime() >= startDate.getTime();
      const isEndDateMatch =
        !endDate ||
        new Date(leaveRequest.endDate).getTime() <= endDate.getTime();

      return (
        (isStartDateMatch &&
          isEndDateMatch &&
          leaveRequest.selectedUser.toLowerCase().includes(lowerSearchQuery)) ||
        (isStartDateMatch &&
          isEndDateMatch &&
          leaveRequest.leaveType.toLowerCase().includes(lowerSearchQuery))
      );
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <div className="leave-list">
      <h2>Current Leave Requests</h2>

      {leaveRequests.length > 0 ? (
        <div className="list-table">
          {!isModalOpen && ( // Only render the filters when the modal is close
            <div className="filter-inputs">
              <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                fullWidth
                sx={{ mt: 1, mb: 1, width: 200 }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Date"
                  value={startDateFilter}
                  onChange={(newValue: Date | null) => {
                    setStartDateFilter(newValue);
                  }}
                />
                <DateTimePicker
                  label="End Date"
                  value={endDateFilter}
                  onChange={(newValue: Date | null) => {
                    setEndDateFilter(newValue);
                  }}
                />
              </LocalizationProvider>
            </div>
          )}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ mb: 2 }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Number of days</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeaveRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No Leave Requests Found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeaveRequests.map((leaveRequest: LeaveRequest) => (
                    <TableRow key={leaveRequest.requestId}>
                      <TableCell component="th" scope="row">
                        {leaveRequest.selectedUser}
                      </TableCell>
                      <TableCell>{leaveRequest.leaveType}</TableCell>
                      <TableCell>{leaveRequest.numberOfDays}</TableCell>
                      <TableCell>
                        {dayjs(leaveRequest.startDate)
                          .tz("Australia/Brisbane")
                          .format("ddd, DD MMM YYYY HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        {dayjs(leaveRequest.endDate)
                          .tz("Australia/Brisbane")
                          .format("ddd, DD MMM YYYY HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <EditIcon
                          className="edit-icon"
                          onClick={() => handleEditRequest(leaveRequest)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={leaveRequests.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      ) : (
        <p>No leave requests found.</p>
      )}

      <button className="leave-list-button" onClick={toggleModal}>
        Add New Leave Request
      </button>
      <ReactModal isOpen={isModalOpen} onRequestClose={toggleModal}>
        <LeaveRequestForm
          onSubmit={handleFormSubmit}
          onEdit={handleEditSubmit}
          onClose={toggleModal}
          initialValues={editingLeaveRequest as LeaveRequest}
          isEditing={isEditing}
        />
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

export default LeaveList;
