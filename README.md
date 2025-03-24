# Todo App

This is a React-based Todo List application designed to help users manage tasks efficiently. The app follows CRUD principles, offers a polished UI/UX, and includes features like task grouping and progress tracking. Built with modern tools and libraries, it provides a robust foundation for task management with thoughtful enhancements.

---

## Features

### Core Functionality (CRUD)

- **Create Todos**: Add new todos with a title and group assignment via a modal interface.
- **Read Todos**: View todos organized by groups, with details accessible in an expandable modal.
- **Update Todos**: Toggle completion status, edit titles, and adjust group or starred status.
- **Delete Todos**: Remove todos (completed or not) with a single click, updating the app seamlessly.

### Progress Tracking

- **Task Stats**: Displays total completed vs. pending tasks in the header (logic via `useTodoStats` hook; pie chart UI planned but not implemented).

### UI/UX Enhancements

- **Task Groups**: Organize todos into categories (e.g., Personal, Work, Shopping) with a dropdown for group selection.
- **Filters**:
  - **Starred Items**: Toggle to show only starred todos.
  - **Date Sorting**: Sort todos by newest or oldest creation date.
  - **Search**: Filter todos by title using a search bar.
- **Completion Toggle**: Move completed todos back to "To-do" status with ease.
- **Date Display**: Shows `createdDate` and `completedDate` in a human-readable format (e.g., "2 days ago") using `date-fns`.
- **Modals**: Clean, animated modals (via `react-modal` and `framer-motion`) for creating, viewing, and editing todos.

### Bonus Features

- **Protected Group Deletion**: Prevents deletion of a todo group if it contains active todos, ensuring data integrity—users must clear or reassign todos first, avoiding accidental loss of tasks.
- **Neat Project Organization**: Structured with a clear separation of concerns—Redux slices in `slices/`, custom hooks in `hooks/`, and components in `components/`, making the codebase scalable and maintainable.
- **Custom Stats Hook**: Implemented `useTodoStats` to calculate task completion stats dynamically, reusable across the app for future UI expansions like progress bars.
- **Toast Notifications**: Integrated `react-hot-toast` for real-time feedback on actions (e.g., "Todo created", "Todo deleted"), enhancing user experience.
- **Redux-Powered State**: Utilizes Redux with Redux Toolkit for centralized, predictable state management, ensuring smooth data flow and scalability.
  **Protected Group Deletion**:
  - Added to "Bonus Features" with a clear description: "Prevents deletion of a todo group if it contains active todos, ensuring data integrity—users must clear or reassign todos first, avoiding accidental loss of tasks." This reflects the functionality you described and positions it as a thoughtful enhancement.

---

### Project Configuration: Adding Craco for Type Alias Support

In this project, we've integrated the **Craco (Create React App Configuration Override)** package to enable **type alias support** for imports. This was necessary because **Create React App (CRA)** no longer natively supports Webpack aliases, which are essential for cleaner and more maintainable import paths.

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14.x or higher (download from [nodejs.org](https://nodejs.org/))
- **npm**: Version 6.x or higher (comes with Node.js)
- **Git**: For cloning the repository (download from [git-scm.com](https://git-scm.com/))

---

### Installation

### 1. Clone the Repository

Clone the Todo App repository to your local machine using Git:

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

### Install Dependencies

Install the required npm packages by running:

```bash
npm install
```

### Configure Environment

Set up environment variables to customize the app’s configuration:

1. **Create a `.env` file** in the project root.
2. Add the following environment variable to configure the API URL:

   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```

### Running the Application

To start the development server and run the application, use the following command:

```bash
npm run dev
```
