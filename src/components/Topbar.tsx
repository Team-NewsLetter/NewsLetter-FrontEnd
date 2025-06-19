import { useLocation, useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };
  const hideLogout = ["/login", "/signup"].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 w-full h-15 bg-white text-[#2962FF] flex items-center justify-between px-4 z-50">
      <h1 className="text-xl font-black">Today News</h1>
      {!hideLogout && (
        <button
          onClick={handleLogout}
          className="text-sm border border-[#2962FF]/60 px-2 py-1 rounded hover:bg-blue-50/60"
        >
          로그아웃
        </button>
      )}
    </header>
  );
};

export default Topbar;
