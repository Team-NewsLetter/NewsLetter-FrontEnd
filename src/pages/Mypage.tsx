import { getMyPage } from "../apis/mypage";
import { useQuery } from "@tanstack/react-query";

const MyPage = () => {
  const getThisWeekDates = (): string[] => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(`${date.getDate()}`);
    }
    return dates;
  };

  const weekDates = getThisWeekDates();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myPage"],
    queryFn: getMyPage,
  });

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (isError || !data)
    return <div className="p-4">데이터를 불러오지 못했습니다.</div>;

  enum UserTag {
    animal = "동물",
    plant = "식물",
    food = "음식",
    policy = "정책",
    science = "과학",
    life = "생활",
  }

  const user = {
    name: data.nickname,
    streak: data.totalNewsReadCount,
    todayNews: data.todayNewsReadCount,
    continueDays: data.consecutiveReadDays,
    actionCount: data.practiceCount,
    weekCheck: data.dailyNewsCheck.map((d: any) => d.checked),
    tagStats: Object.fromEntries(
      data.userTagPreferenceStatics.map((t: any) => [
        UserTag[t.tag as keyof typeof UserTag] ?? t.tag,
        t.percentage,
      ])
    ),
  };
  const days = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl text-gray-700 font-bold mt-10 mb-3">마이페이지</h2>

      {/* 유저 정보 카드 */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#2962FF] text-white flex items-center justify-center font-semibold">
            {user.name.slice(0, 2)}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-700">{user.name}</p>
            <p className="text-sm text-gray-500">
              총 {user.streak}일째 기후 생각
            </p>
          </div>
        </div>
        <button className="text-sm text-[#2962FF] border border-[#2962FF] rounded px-3 py-1 hover:bg-blue-50">
          수정
        </button>
      </div>

      {/* 수치 정보 */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xl font-bold text-[#2962FF]">{user.todayNews}</p>
          <p className="text-gray-600">오늘 뉴스</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xl font-bold text-[#2962FF]">
            {user.continueDays}
          </p>
          <p className="text-gray-600">연속일</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xl font-bold text-[#2962FF]">{user.actionCount}</p>
          <p className="text-gray-600">실천 횟수</p>
        </div>
      </div>

      {/* 주간 체크 현황 */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <h3 className="font-bold text-sm mb-4 text-gray-700">
          이번 주 기후 체크 현황
        </h3>
        <div className="grid grid-cols-7 text-center text-xs gap-1">
          {user.weekCheck.map((checked: boolean, i: number) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                checked
                  ? "bg-[#2962FF] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {weekDates[i]}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 mt-2 text-center text-xs text-gray-500">
          {days.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>

      {/* 관심 태그 분석 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-4 text-gray-700">관심 태그 분석</h3>
        <div className="space-y-2">
          {Object.entries(user.tagStats).map(([tag, value]) => (
            <div key={tag}>
              <p className="text-sm text-gray-600 mb-2">#{tag}</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#2962FF] h-3 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
