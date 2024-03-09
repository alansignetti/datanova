import "../styles/LeaveList.css";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import LeaveRequestForm from "./LeaveRequestForm";
import { LeaveRequest } from "../interface/LeaveRequest";
import { useSelector, useDispatch } from "react-redux";
import { addLeaveRequest } from "../store/slices/leaveRequestSlice";
import { AppDispatch, RootState } from "../store/store";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const LeaveList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [selectedUserFilter, setSelectedUserFilter] = useState<string | null>(
    null
  );
  const leaveRequests: LeaveRequest[] = useSelector<RootState>(
    (state) => state.leaveRequests.leaveRequests
  ) as LeaveRequest[];

  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  const dispatch = useDispatch<AppDispatch>();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFormSubmit = async (data: LeaveRequest) => {
    try {
      const response = await dispatch(addLeaveRequest(data));

      if (response.payload) {
        // Success
        console.log("Form submitted successfully:", data);

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

  return (
    <div className="leave-list">
      <h2>Current Leave Requests</h2>

      {leaveRequests.length > 0 ? (
        <div className="list-table">
          {!isModalOpen && ( // Only render the search bar when the modal is open
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
                    console.log(Date.parse(newValue));
                    console.log(Date.parse(leaveRequests[0].startDate));
                    setStartDateFilter(newValue);
                  }}
                />
                <DateTimePicker
                  label="End Date"
                  value={endDateFilter}
                  onChange={(newValue: Date | null) => {
                    console.log(newValue);
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
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests
                  .filter((leaveRequest) => {
                    const lowerSearchQuery = searchQuery.toLowerCase();
                    const startDate = startDateFilter
                      ? new Date(startDateFilter)
                      : null;
                    const endDate = endDateFilter
                      ? new Date(endDateFilter)
                      : null;

                    const isStartDateMatch =
                      !startDate ||
                      new Date(leaveRequest.startDate).getTime() >=
                        startDate.getTime();
                    const isEndDateMatch =
                      !endDate ||
                      new Date(leaveRequest.endDate).getTime() <=
                        endDate.getTime();
                    console.log(leaveRequest.startDate);
                    console.log(startDate);
                    return (
                      (isStartDateMatch &&
                        isEndDateMatch &&
                        leaveRequest.selectedUser
                          .toLowerCase()
                          .includes(lowerSearchQuery)) ||
                      (isStartDateMatch &&
                        isEndDateMatch &&
                        leaveRequest.leaveType
                          .toLowerCase()
                          .includes(lowerSearchQuery))
                    );
                  })
                  .map((leaveRequest: LeaveRequest) => (
                    <TableRow
                      key={leaveRequest.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}>
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
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <p>No leave requests found.</p>
      )}

      <button className="leave-list-button" onClick={toggleModal}>
        Add New Leave Request
      </button>
      <ReactModal isOpen={isModalOpen} onRequestClose={toggleModal}>
        <LeaveRequestForm onSubmit={handleFormSubmit} onClose={toggleModal} />
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

export default LeaveList;
