import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

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

function generateRandomLeaveDate(isStartDate = true) {
  const baseDate = dayjs();
  const daysOffset = Math.floor(Math.random() * 30); // Random offset within next 30 days
  const direction = isStartDate ? "subtract" : "add";
  return baseDate
    .clone()
    [direction](daysOffset, "day")
    .format("M/D/YYYY, HH:mm:ss");
}

function calculateLeaveDays(startDate: string, endDate: string) {
  const momentStartDate = dayjs(startDate);
  const momentEndDate = dayjs(endDate);
  return momentEndDate.diff(momentStartDate, "days") + 1; // Include both start and end day
}

function pickRandomLeaveType() {
  const leaveTypes = ["vacation", "sick", "personal"];
  const randomIndex = Math.floor(Math.random() * leaveTypes.length);
  return leaveTypes[randomIndex];
}
// export const preloadedState = {
//   leaveRequests: {
//     leaveRequests: users
//       .slice(1)
//       .map(() => ({
//         requestId: Math.floor(Math.random() * 1000000000000),
//         selectedUserId: Math.floor(Math.random() * 10) + 1,
//         startDate: generateRandomLeaveDate(true),
//         endDate: generateRandomLeaveDate(false),
//         leaveType: pickRandomLeaveType(),
//         reason: faker.lorem.sentence(),
//         selectedUser: "Placeholder",
//         numberOfDays: calculateLeaveDays(
//           generateRandomLeaveDate(true),
//           generateRandomLeaveDate(false)
//         ),
//       }))
//       .slice(0, 30), // Generate 10,000 requests
//   },
// };

export const preloadedState = {
  leaveRequests: {
    leaveRequests: users
      .slice(1) // Obtener todos los usuarios excepto el marcador de posición
      .flatMap((user) => {
        const requests = [];
        for (let i = 0; i < 1000; i++) {
          requests.push({
            requestId: Math.floor(Math.random() * 1000000000000),
            selectedUserId: user.id,
            startDate: generateRandomLeaveDate(true),
            endDate: generateRandomLeaveDate(false),
            leaveType: pickRandomLeaveType(),
            reason: faker.lorem.sentence(),
            selectedUser: user.name, // Usar el nombre del usuario
            numberOfDays: calculateLeaveDays(
              generateRandomLeaveDate(true),
              generateRandomLeaveDate(false)
            ),
          });
        }
        return requests;
      })
      .slice(0, 10000), // Ajustar el número total de solicitudes
  },
};
