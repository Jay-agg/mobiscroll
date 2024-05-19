# Mobiscroll Clone

## Overview

This is a React-based calendar application that allows users to manage events by dragging and resizing them across resources. The application supports functionalities like highlighting today's date, adding more resources, and deleting events with an alert popup.

## Interface

![A screenshot of the application](<src/assets/Screenshot 2024-05-19 at 10.40.41 PM.png>)

##Installation

To set up and run this project locally, follow these steps:

1. **Clone the Repository**

2. **Install Dependencies**
   Ensure you have Node.js and npm installed. If not, download and install them from [Node.js](https://nodejs.org/).

   ```sh
   npm install
   ```

3. **Run the Development Server**
   Start the Vite development server to see your project in action.

   ```sh
   npm run dev
   ```

   This command will start the development server and typically open your default browser at `http://localhost:3000`. If it doesn’t open automatically, you can manually navigate to this address.

4. **Build the Project for Production**
   To create an optimized production build of your project, run:

   ```sh
   npm run build
   ```

   This will generate a `dist` directory with the production-ready files.

5. **Preview the Production Build**
   To preview the production build locally, you can use Vite’s preview command:

   ```sh
   npm run preview
   ```

   This command will serve the contents of the `dist` directory locally, allowing you to verify the production build.

6. **Additional Configuration**
   Depending on your deployment environment, you might need to configure additional settings such as environment variables, API endpoints, or build configurations. Refer to the Vite documentation for more details on configuring your project: [Vite Documentation](https://vitejs.dev/).

### Project Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build locally.

By following these steps, you should be able to set up and run the project locally on your machine. If you encounter any issues, refer to the Vite documentation or seek assistance from the project’s maintainers.

## Features

### Monthly View with Resource Allocation:

-Renders a calendar for the current month with dynamic resource allocation.
-Utilizes a grid layout where resources (e.g., employees, equipment) are listed vertically and days horizontally.

### Add Resources:

    -Provides an input form to dynamically add new resources.
    -Resources are managed in the component state and displayed in a sticky sidebar.

### Drag-and-Drop Event Creation:

    -Implements drag-and-drop functionality to create events by selecting and dragging across calendar cells.
    -Supports multi-hour and multi-day event creation.

### Event Display:

    -Renders events as colored bars on the calendar, displaying event titles and time ranges.
    -Events are dynamically styled based on their properties.

### Event Selection and Deletion:

    -Allows event selection through click events.
    -Supports event deletion via keyboard event handling (Delete key).

### Event Resizing:

    -Implements event resizing by dragging a resize handle at the event's bottom-right corner.
    -Utilizes event listeners to dynamically update event duration.

### Event Dragging:

    -Enables drag-and-drop functionality for repositioning events across different times or resources.
    -Uses state management to handle the drag state and update event positions.

### Local Storage Persistence:

    -Implements local storage to persist the current month, year, events, and resources.
    -Ensures state persistence across page reloads using useEffect hooks to sync state with local storage.

### Current Day Highlighting:

    -Highlights the current day with a distinct color for easy identification.
    -Uses conditional rendering to apply styles dynamically.

### Prerequisites

- Node.js and npm installed on your machine.

## Overview

### 3 things that you learned from this assignment?

1. **Advanced State Management Techniques in React**:

   - This assignment deepened my understanding of state management in React, particularly the effective use of `useState` and `useEffect` hooks. Managing complex states like drag-and-drop operations, event resizing, and persistent state using local storage provided hands-on experience with real-world state management scenarios.

2. **Implementing Interactive UI Features**:

   - I learned how to implement interactive UI features such as drag-and-drop and resizing functionality. Handling mouse events (`onMouseDown`, `onMouseMove`, `onMouseUp`) to create a responsive and intuitive user interface involved understanding the intricacies of event handling and updating state dynamically based on user interactions.

3. **Persisting State with Local Storage**:
   - The assignment highlighted the importance of persisting state to ensure data is retained across page reloads. Using local storage to save and retrieve the current month, year, events, and resources demonstrated practical techniques for maintaining application state and providing a seamless user experience. This reinforced the concept of leveraging browser storage for state persistence in web applications.

### What was the most difficult part of the assignment?

The most difficult part of the assignment was implementing the drag-and-drop functionality for events and resources. Managing the state to accurately reflect the start and end times of events during drag operations required precise handling of mouse events and real-time updates to the UI. Ensuring that events were correctly placed and resized without glitches involved a thorough understanding of event propagation and coordinate calculations. Additionally, maintaining the responsiveness and usability of the interface while dealing with these complex interactions was challenging.

### What you would have done differently given more time?

Given more time, I would have focused on the following improvements:

-Enhanced User Interface and Experience:

Invest more effort into the design and usability of the calendar, including better visual cues for drag-and-drop operations, smoother animations, and a more polished overall look. This could involve integrating a design framework or library like Material-UI to enhance the aesthetic appeal and functionality.

-Improved Event Management:

Implement more advanced event management features such as recurring events, better conflict detection, and more detailed event descriptions. Adding the ability to categorize events and filter views based on these categories would also enhance the usability of the application.

-Testing and Error Handling:

Write comprehensive unit and integration tests to ensure the robustness of the application. Using testing libraries such as Jest and React Testing Library would help catch bugs and ensure that the application behaves as expected under various scenarios. Additionally, improve error handling to provide more informative feedback to users when something goes wrong.

-Optimized Performance:

Optimize the performance of the application by minimizing re-renders and efficiently managing state updates. This could involve using techniques such as memoization and optimizing the use of React hooks to ensure the application remains responsive even with a large number of events and resources.
