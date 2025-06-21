import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { getCardNewsList } from "../apis/cardnews";
import { CardNews } from "../types/cardnews";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import characterImg from "../images/character_practice.png"; // 위치 확인하세요

const PracticeNewsListPage = () => {
  const navigate = useNavigate();
  dayjs.extend(relativeTime);
  dayjs.locale("ko");

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["cardNews", "practice"],
      queryFn: ({ pageParam = 0 }) =>
        getCardNewsList({
          page: pageParam,
          size: 5,
          type: "practice",
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage.number;
        return lastPage.last ? undefined : currentPage + 1;
      },
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isPending) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isPending, isFetchingNextPage]);

  const allNews: CardNews[] = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className="pt-15 pb-32 overflow-x-hidden">
      {/* 제목 + 설명 */}
      <div className="px-4 flex flex-col gap-1 mb-6">
        <h1 className="text-blue-500 font-bold text-xl">실천 뉴스</h1>
        <p className="text-gray-500 text-sm">
          오늘 하나, 작게 실천해볼까요? 🌱
        </p>
      </div>

      {/* 뉴스 카드 리스트 */}
      <div className="flex flex-col gap-4 px-4 mt-4">
        {isPending
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-gray-200 animate-pulse h-24 rounded-lg"
              />
            ))
          : allNews.map((news, index) => (
              <div key={news.id}>
                {/* 캐릭터 배치 */}
                {index === 2 && (
                  <div className="text-center mb-4">
                    <img
                      src={characterImg}
                      alt="실천 캐릭터"
                      className="w-20 h-20 mx-auto"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      응원해요! 작은 변화가 큰 변화를 만들어요!
                    </p>
                  </div>
                )}

                {/* 카드 구성 */}
                <div
                  onClick={() => navigate(`/news/${news.id}`)}
                  className={`bg-white border border-gray-200 rounded-xl shadow-sm ${
                    index === 0 ? "p-4" : "flex items-center gap-3 p-3"
                  } hover:bg-gray-50 cursor-pointer transition`}
                >
                  <img
                    src={news.thumbnailUrl}
                    alt={news.title}
                    className={`object-cover rounded-md ${
                      index === 0 ? "h-32 w-full" : "w-14 h-14"
                    }`}
                  />
                  <div className={index === 0 ? "mt-2" : "flex-1"}>
                    <p
                      className={`${
                        index === 0
                          ? "font-semibold text-gray-800"
                          : "text-sm font-medium line-clamp-2 text-gray-800"
                      }`}
                    >
                      {news.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dayjs(news.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

        {/* 다음 페이지 로딩 중 스켈레톤 */}
        {isFetchingNextPage &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`next-loading-${i}`}
              className="h-20 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
      </div>

      {/* 스크롤 트리거 */}
      <div ref={ref} className="h-1" />
    </div>
  );
};

export default PracticeNewsListPage;
