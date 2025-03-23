import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavAnimating, setIsNavAnimating] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isNavAnimating={isNavAnimating}
        setIsNavAnimating={setIsNavAnimating}
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
      />
      <Sidebar
        isNavOpen={isNavOpen}
        setIsNavAnimating={setIsNavAnimating}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
  );
}

export default Layout;
