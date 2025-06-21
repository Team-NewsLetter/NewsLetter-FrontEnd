import { FaEnvelope } from "react-icons/fa";
import Progress from "../components/Progress";
import { useNavigate } from "react-router-dom";
import { useHome } from "../apis/home";

const HomePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useHome();

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (error || !data?.result)
    return <div className="p-4">오류가 발생했습니다.</div>;

  const {
    level,
    newsReadingCount,
    practiceCount,
    speechBubble,
    characterImageUrl,
    backgroundImageUrl,
  } = data.result;

  return (
    <div className="relative bg-white text-gray-800 h-screen overflow-hidden ">
      {/* 배경 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(http://51.20.65.235:8080${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 상단 LV 카드 */}
      <section className="relative z-10 px-4 pt-17">
        <div className="bg-white rounded-xl shadow-md p-4 ">
          <div className="flex items-center mb-2">
            <div className="bg-[#2962FF] text-white text-xs font-bold px-2 py-1 rounded-full">
              Lv
            </div>
            <span className="ml-2 font-semibold">레벨 {level}</span>
          </div>
          <Progress value={(level / 20) * 100} />
          <div className="mt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>✅ 읽은 게시물</span>
              <span className="text-black">{newsReadingCount}개</span>
            </div>
            <div className="flex justify-between">
              <span>🟠 실천 횟수</span>
              <span className="text-black">{practiceCount}회</span>
            </div>
          </div>
        </div>
      </section>

      {/* 수료증 버튼 – 살짝 아래로 */}
      <button
        onClick={() => navigate("/collection")}
        className="absolute top-50 right-4 text-[#ffd901] shadow-lg z-20"
      >
        <FaEnvelope size={60} />
      </button>

      {/* 캐릭터 + 말풍선 */}
      <div className="relative w-full flex items-center justify-center">
        {/* 말풍선 - 캐릭터 머리 위로 조금 더 당김 */}
        <div className="absolute top-[60px] z-20">
          <div className="relative bg-white text-gray-800 text-sm px-4 py-3 rounded-2xl shadow-lg border border-gray-200 max-w-xs">
            {speechBubble}
            <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]" />
            </div>
          </div>
        </div>

        {/* 캐릭터 – 더 크게 & 더 위로 */}
        <div
          className="absolute top-[125px] w-56 h-56 bg-no-repeat bg-contain bg-center"
          style={{
            backgroundImage: `url(http://51.20.65.235:8080${characterImageUrl})`,
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
