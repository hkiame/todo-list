import AppRoutes from "@/routes";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "2px dotted #15803D",
            borderRadius: "0.5rem",
            padding: "1rem",
            maxWidth: "24rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          success: {
            style: {
              background: "#A7F3D0", // emerald-200
              color: "#065F46", // emerald-800
            },
            iconTheme: {
              primary: "#10B981", // emerald-500
            },
          },
          error: {
            style: {
              background: "#FEE2E2", // red-100
              color: "#991B1B", // red-800
            },
            iconTheme: {
              primary: "#EF4444", // red-500
            },
          },
          info: {
            style: {
              background: "#F3F4F6", // gray-100
              color: "#1F2937", // gray-800
            },
            iconTheme: {
              primary: "#6B7280", // gray-500
            },
          },
          duration: 3000, // Auto-dismiss after 3s
        }}
      />
    </Provider>
  );
}

export default App;
