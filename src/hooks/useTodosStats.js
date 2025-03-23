import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "../slices/todosSlice";

export const useTodoStats = () => {
  const dispatch = useDispatch();
  const { items: todos, status, error } = useSelector((state) => state.todos);

  // Fetch todos on mount if not already fetched
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  // Calculate completion stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter((todo) => todo.isComplete).length;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    todos, // Raw todos array
    totalTasks, // Total number of tasks
    completedTasks, // Number of completed tasks
    completionPercentage, // Percentage of tasks completed
    status, // Loading state: 'idle', 'loading', 'succeeded', 'failed'
    error, // Any error from fetching todos
  };
};
