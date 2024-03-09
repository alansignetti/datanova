# Datanova Challenge

This project is the result of my participation in the Datanova challenge, where the goal was to build an interactive web application using modern web technologies. I've dedicated over 10 hours to this project, and here's what I've accomplished.

## Technologies Used

- **React with Vite and TypeScript:** The project leverages React for a dynamic and maintainable user interface, coupled with Vite for efficient development and TypeScript for type safety.
- **MUI CSS:** MUI provides pre-built components and rapid styling capabilities, allowing for faster development and a consistent design language.
- **Faker:** This library generates a massive amount of random data, making it ideal for load testing.

This project was generated with React version 18.2.0.

## Task Details

The application presents a home screen with:

- A list of current leave requests
- A button to add a new leave request

Clicking the "Add New Leave Request" button should open a modal containing a form for creating a new request. This form includes:

- **Date Pickers:** For selecting the start and end date of the leave request.
- **Leave Type Dropdown:** Users can choose from various leave types (e.g., personal, sick, vacation, bereavement).
- **Number of Days Display:** This section dynamically calculates and displays the number of days based on the chosen start and end dates, rounded to two decimal places using the floor function (e.g., 4.376 becomes 4.37).
- **Reason Text Area:** Users can provide a reason for their leave request, limited to 50 characters.
- **User Selection Dropdown:** A dummy list of approximately 10 users is available for assigning the leave request.

Clicking the "Save" button triggers the saving process. If the request fails due to any of the following reasons, an indicator should be displayed:

- Overlapping Leave Request: The requested leave period conflicts with an existing leave request.
- Start Date Before Today: The selected start date precedes the current date.
- End Date Before Start Date: The selected end date falls before the start date.
- Empty Reason: No reason is provided for the leave request.
- Zero Days Requested: The calculated number of days is zero.
- Empty Leave Type: No leave type is selected.
- Empty User Selection: No user is assigned to the leave request.

Upon successful saving, the user returns to the home screen.

The home screen offers various functionalities for managing leave requests:

- **Search:** A search bar allows users to filter leave requests based on keywords.
- **Filtering:** Users can filter leave requests by start/end date and user.
- **Details View:** Clicking on a leave request opens a dedicated view displaying its details and providing an option for editing the request.

## Load Testing

To simulate real-world usage, 10,000 fake leave requests are generated using Faker.

## Test the Project

Experience the application live here: [https://alansignetti.github.io/datanova/](https://alansignetti.github.io/datanova/)


