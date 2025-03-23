// src/hooks/useTodoStats.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "../slices/todosSlice";

export const useTodoStats = () => {
  const dispatch = useDispatch();
  const {
    items: todos,
    status: todosStatus,
    error: todosError,
  } = useSelector((state) => state.todos);
  const { selectedGroupId } = useSelector((state) => state.groups);

  useEffect(() => {
    if (todosStatus === "idle") {
      dispatch(fetchTodos());
    }
  }, [todosStatus, dispatch]);

  const filteredTodos = selectedGroupId
    ? todos.filter((todo) => todo.group === selectedGroupId)
    : todos;

  const totalTasks = filteredTodos.length;
  const completedTasks = filteredTodos.filter((todo) => todo.isComplete).length;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    todos: filteredTodos,
    totalTasks,
    completedTasks,
    completionPercentage,
    status: todosStatus,
    error: todosError,
  };
};
