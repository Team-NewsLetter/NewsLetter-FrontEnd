import { GrCertificate } from "react-icons/gr";
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
    <div className="flex flex-col bg-white text-gray-800">
      <section className="px-4 mb-4">
        <div className="bg-white rounded-xl shadow-md p-4 mt-20">
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
              <span className="text-black">{newsReadingCount}개</span>{" "}
            </div>
            <div className="flex justify-between">
              <span>🟠 실천 횟수</span>
              <span className="text-black">{practiceCount}회</span>{" "}
            </div>
          </div>
        </div>
      </section>

      <section
        className="flex-1 flex flex-col items-center justify-center rounded-xl"
        style={{
          backgroundImage: `url(http://51.20.65.235:8080${backgroundImageUrl})`,
          backgroundSize: "contain",
        }}
      >
        <div
          className="w-49 h-49 mb-4 bg-no-repeat bg-contain bg-center"
          style={{
            backgroundImage: `url(http://51.20.65.235:8080${characterImageUrl})`,
          }}
        />
        <button
          onClick={() => navigate("/collection")}
          className="absolute top-16 right-4 bg-white border border-[#ff9429] text-[#ffd901] p-3 rounded-full shadow-lg hover:bg-blue-50"
        >
          <GrCertificate size={50} />
        </button>
      </section>

      <div className="w-full h-[25vh] bg-gray-200 flex items-center justify-center text-sm text-gray-800 rounded-2xl">
        {speechBubble}
      </div>
    </div>
  );
};

export default HomePage;
