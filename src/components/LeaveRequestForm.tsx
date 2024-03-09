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
import { LeaveRequest } from "../interface/LeaveRequest";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

interface LeaveRequestFormProps {
  onSubmit: (data: LeaveRequest) => void;
  onClose: () => void; // Add the onClose property
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [leaveType, setLeaveType] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
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
  }, [startDate, endDate, leaveType, reason, selectedUser, duration]);

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
        selectedUser !== "" &&
        reason !== "" &&
        duration !== 0
    );
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
    setSelectedUser(event.target.value);
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
        startDate:
          startDate?.toLocaleString("en-AU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) || "",
        endDate:
          endDate?.toLocaleString("en-AU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) || "",

        leaveType,
        reason,
        selectedUser,
        numberOfDays: duration,
      };
      onSubmit(newLeaveRequest);
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
          value={selectedUser}
          onChange={handleUserChange}>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.name}>
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
      <button onClick={onClose} className="close">
        Close
      </button>
    </form>
  );
};

export default LeaveRequestForm;
