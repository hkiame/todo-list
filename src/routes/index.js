import { Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import Homepage from "@/pages/Homepage";
import ToDoItemsPage from "@/pages/TodoItemsPage";
import { CompletedItemsPage } from "@/pages/CompletedItemsPage";
import EditTodo from "@/pages/EditTodo";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Homepage />} />
      <Route path="todos" element={<ToDoItemsPage />} />
      <Route path="completed" element={<CompletedItemsPage />} />
      <Route path="edit" element={<EditTodo />} />
    </Route>
  </Routes>
);

export default AppRoutes;
