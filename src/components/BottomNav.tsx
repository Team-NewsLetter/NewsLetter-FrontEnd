import { NavLink } from "react-router-dom";
import { FiAlertCircle, FiCalendar, FiCheckCircle } from "react-icons/fi";
import { MdPersonOutline, MdSentimentSatisfiedAlt } from "react-icons/md";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="relative flex justify-between items-center py-3">
        <div className="flex flex-1 justify-evenly">
          <NavLink
            to="/urgent"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs pr-4 ${
                isActive ? "text-[#2962FF]" : "text-gray-500"
              }`
            }
          >
            <FiAlertCircle size={24} />
            <span>긴급</span>
          </NavLink>

          <NavLink
            to="/daily"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs pr-5 ${
                isActive ? "text-[#2962FF]" : "text-gray-500"
              }`
            }
          >
            <FiCalendar size={24} />
            <span>일상</span>
          </NavLink>
        </div>

        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 z-10">
          <NavLink to="/">
            <div className="w-16 h-16 rounded-full bg-white border-5 border-[#2962FF] flex items-center justify-center shadow-lg">
              <MdSentimentSatisfiedAlt size={42} className="text-gray-500" />
            </div>
          </NavLink>
        </div>

        <div className="flex flex-1 justify-evenly">
          <NavLink
            to="/practice"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs pl-6 ${
                isActive ? "text-[#2962FF]" : "text-gray-500"
              }`
            }
          >
            <FiCheckCircle size={24} />
            <span>실천</span>
          </NavLink>

          <NavLink
            to="/mypage"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs pl-2 ${
                isActive ? "text-[#2962FF]" : "text-gray-500"
              }`
            }
          >
            <MdPersonOutline size={24} />
            <span>마이페이지</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
