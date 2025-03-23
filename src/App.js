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
            borderRadius: "0.5rem",
            padding: "1rem",
            maxWidth: "24rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          success: {
            style: {
              border: "2px dotted #15803D",
              background: "#A7F3D0",
              color: "#065F46",
            },
            iconTheme: {
              primary: "#10B981",
            },
          },
          error: {
            style: {
              border: "2px dotted #991B1B",
              background: "#FEE2E2",
              color: "#991B1B",
            },
            iconTheme: {
              primary: "#EF4444",
            },
          },
          info: {
            style: {
              border: "2px dotted #1F2937",
              background: "#F3F4F6",
              color: "#1F2937",
            },
            iconTheme: {
              primary: "#6B7280",
            },
          },
          duration: 3000,
        }}
      />
    </Provider>
  );
}

export default App;
