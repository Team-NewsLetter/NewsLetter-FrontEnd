import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import BottomNav from "../components/BottomNav";

const RootLayout = () => {
  return (
    <div className="flex bg-[#F7F8FA] min-h-screen p-6">
      <div className="flex-1">
        <Topbar />
        <main className="p-0">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default RootLayout;
