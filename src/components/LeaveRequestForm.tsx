import React, { useState, useEffect, useRef } from "react";
import "../styles/LeaveRequestForm.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  TextareaAutosize,
} from "@mui/material";
import dayjs from "dayjs";

interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  selectedUser: number;
}

interface LeaveRequestFormProps {
  onSubmit: (data: LeaveRequest) => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [leaveType, setLeaveType] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [duration, setDuration] = useState(0);
  const [isValidForm, setIsValidForm] = useState<boolean>(true);
  const errorForm = {
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
    selectedUser: "",
  };
  const [errors, setErrors] = useState(errorForm);

  useEffect(() => {
    validateForm();
  }, [startDate, endDate, leaveType, reason, selectedUser]);

  // useEffect hook to call calculateDuration on change
  useEffect(() => {
    calculateDuration();
  }, [endDate, startDate]);

  const users = [
    { id: 0, name: "-- Please Select User --" },
    { id: 1, name: "Dale Pienaar" },
    { id: 2, name: "Antony Puckey" },
    { id: 3, name: "Joshua O'Dea" },
    { id: 4, name: "Alan Signetti" },
    { id: 5, name: "Michael Brown" },
    { id: 6, name: "William Martinez" },
    { id: 7, name: "Sophia Anderson" },
    { id: 8, name: "James Taylor" },
    { id: 9, name: "Charlotte Thomas" },
    { id: 10, name: "Daniel Hernandez" },
  ];

  const validateForm = () => {
    setIsValidForm(
      startDate !== null &&
        endDate !== null &&
        leaveType !== "" &&
        selectedUser !== 0 &&
        reason !== "" &&
        duration !== 0
    );
    console.log("Es valido:" + isValidForm);
  };

  const calculateDuration = () => {
    if (startDate && endDate) {
      const diffInMs = dayjs(endDate).diff(startDate, "millisecond");
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      setDuration(Math.floor(diffInDays * 100) / 100); // Floor rounding
    } else {
      setDuration(0);
    }
  };

  const handleUserChange = (event: { target: { value: string } }) => {
    setSelectedUser(parseInt(event.target.value, 10));
  };
  const handleLeaveTypeChange = (event: { target: { value: string } }) => {
    setLeaveType(event.target.value);
  };
  const handleEndDateChange = (newDate: Date | null) => {
    setEndDate(newDate);
  };
  const handleStartDateChange = (newDate: Date | null) => {
    setStartDate(newDate);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
    errorHandler();
  };

  const errorHandler = () => {
    const newErrors: {
      startDate?: string;
      endDate?: string;
      leaveType?: string;
      reason?: string;
      selectedUser?: string;
    } = {};
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!leaveType) newErrors.leaveType = "Leave type is required";
    if (!reason) newErrors.reason = "Reason is required";
    if (!selectedUser) newErrors.selectedUser = "User is required";

    setErrors(
      newErrors as {
        startDate: string;
        endDate: string;
        leaveType: string;
        reason: string;
        selectedUser: string;
      }
    );

    if (Object.keys(newErrors).length === 0) {
      // Only submit if no errors
      const newLeaveRequest: LeaveRequest = {
        id: 1,
        startDate: startDate?.toISOString() || "",
        endDate: endDate?.toISOString() || "",
        leaveType,
        reason,
        selectedUser,
      };
      onSubmit(newLeaveRequest);
      console.log("Solicitud de licencia enviada:", newLeaveRequest);
    } else {
      console.log("Invalid form submission:", newErrors); // Log errors for debugging
    }
  };

  return (
    <form onSubmit={handleSubmit} className="leave-request-form">
      <FormControl
        error={!!errors.startDate && !!errors.endDate}
        className="leave-request-form-input__container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Start Date"
            className={`leave-request-form__input ${
              errors.startDate ? "error" : ""
            }`}
            value={startDate}
            onChange={(newValue) => handleStartDateChange(newValue)}
            maxDateTime={endDate}
            slotProps={{
              textField: {
                size: "small",
                error: !!errors.startDate,
              },
            }}
          />
          <FormHelperText error>{errors.startDate}</FormHelperText>
          <DateTimePicker
            label="End Date"
            className={`leave-request-form__input ${
              errors.endDate ? "error" : ""
            }`}
            value={endDate}
            onChange={(newValue) => handleEndDateChange(newValue)}
            defaultValue={startDate}
            minDateTime={startDate}
            slotProps={{
              textField: {
                size: "small",
                error: !!errors.endDate,
              },
            }}
          />
          <FormHelperText error>{errors.endDate}</FormHelperText>
        </LocalizationProvider>
      </FormControl>

      <InputLabel id="leave-type-label" htmlFor="leaveType">
        Leave Type:
      </InputLabel>
      <FormControl error={!!errors.leaveType}>
        <Select
          id="leaveType"
          value={leaveType}
          className="leave-request-form__select"
          onChange={handleLeaveTypeChange}>
          <MenuItem value="">-- Please Select Type --</MenuItem>
          <MenuItem value="personal">Personal</MenuItem>
          <MenuItem value="sick">Sick</MenuItem>
          <MenuItem value="vacation">Vacation</MenuItem>
          <MenuItem value="bereavement">Bereavement</MenuItem>
        </Select>
        {!!errors.leaveType && (
          <FormHelperText>Leave type is required</FormHelperText>
        )}
      </FormControl>

      <InputLabel id="reason-label" htmlFor="reason">
        Reason:
      </InputLabel>
      <FormControl error={!!errors.reason}>
        <TextareaAutosize
          id="reason"
          maxLength={50}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="leave-request-form__textarea"
        />
      </FormControl>
      {!!errors.reason && <FormHelperText>Reason is required</FormHelperText>}
      <InputLabel id="assigned-to-label">Assigned To:</InputLabel>
      <FormControl error={!!errors.selectedUser}>
        <Select
          className="leave-request-form__select"
          labelId="assigned-to-label"
          id="user"
          value={String(selectedUser)}
          onChange={handleUserChange}>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
        {!!errors.selectedUser && (
          <FormHelperText>User is required</FormHelperText>
        )}
      </FormControl>

      <label>Duration: {duration.toFixed(2)} days</label>
      <button type="submit" disabled={!isValidForm}>
        Submit Request
      </button>
    </form>
  );
};

export default LeaveRequestForm;
