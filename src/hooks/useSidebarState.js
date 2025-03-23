import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchGroups,
  createGroup,
  setSelectedGroupId,
} from "@/slices/groupsSlice";
import { fetchTodos } from "@/slices/todosSlice";
import { v4 as uuidv4 } from "uuid";

export const useSidebarState = () => {
  const dispatch = useDispatch();
  const {
    items: groups,
    selectedGroupId,
    status: groupsStatus,
  } = useSelector((state) => state.groups);
  const { items: todos, status: todosStatus } = useSelector(
    (state) => state.todos
  );
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    if (groupsStatus === "idle") {
      dispatch(fetchGroups());
    }
    if (todosStatus === "idle") {
      dispatch(fetchTodos());
    }
  }, [groupsStatus, todosStatus, dispatch]);

  const addGroup = async () => {
    if (!newGroup.trim()) return;
    const newGroupData = { id: uuidv4(), name: newGroup };
    try {
      await dispatch(createGroup(newGroupData))
        .unwrap()
        .then(() => toast.success(`Group added successfully.`))
        .catch(() => toast.error("Failed to add group."));
      setNewGroup("");
    } catch (error) {
      toast.error("Failed to add group.");
      console.error("Error adding group:", error);
    }
  };

  const selectGroup = (groupId) => {
    dispatch(setSelectedGroupId(groupId));
  };

  const filteredTodos = selectedGroupId
    ? todos.filter((todo) => todo.group === selectedGroupId)
    : todos;

  return {
    groups,
    todos: filteredTodos,
    selectedGroupId,
    newGroup,
    setNewGroup,
    addGroup,
    selectGroup,
    groupsStatus,
    todosStatus,
  };
};
