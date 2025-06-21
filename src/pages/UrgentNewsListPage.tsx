import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { getCardNewsList } from "../apis/cardnews";
import { CardNews } from "../types/cardnews";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const UrgentNewsListPage = () => {
  const navigate = useNavigate();

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["cardNews", "urgent"],
      queryFn: ({ pageParam = 0 }) =>
        getCardNewsList({
          page: pageParam,
          size: 6,
          type: "urgent",
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

  const groupedNews = allNews.reduce((acc, news) => {
    const key = dayjs(news.createdAt).format("YYYY-MM-DD HH:mm");
    if (!acc[key]) acc[key] = [];
    acc[key].push(news);
    return acc;
  }, {} as Record<string, CardNews[]>);

  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllGroups = () => {
    const shouldCollapseAll = Object.values(collapsedGroups).some((v) => !v);
    const newState: Record<string, boolean> = {};
    Object.keys(groupedNews).forEach((key) => {
      newState[key] = shouldCollapseAll;
    });
    setCollapsedGroups(newState);
  };

  const [expandedNews, setExpandedNews] = useState<Record<number, boolean>>({});

  return (
    <div className="pt-15 pb-20">
      <div className="px-4 flex items-center justify-between mb-6">
        <h1 className="text-red-600 font-bold text-xl flex items-center gap-2">
          긴급 뉴스
        </h1>
        <button
          onClick={toggleAllGroups}
          className="text-sm text-blue-500 hover:underline"
        >
          {Object.values(collapsedGroups).some((v) => !v)
            ? "모두 접기"
            : "모두 펼치기"}
        </button>
      </div>

      <div className="px-6 relative border-l-4 border-red-400">
        {isPending
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-gray-200 animate-pulse h-40 rounded-lg mb-4 ml-8"
              />
            ))
          : Object.entries(groupedNews).map(([time, newsList]) => {
              const isCollapsed = collapsedGroups[time] ?? false;

              return (
                <div key={time} className="mb-6 pl-4 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroup(time);
                      }}
                      className="text-xs text-gray-500 flex items-center gap-1"
                    >
                      {time}
                      <span className="text-gray-400 text-xs">
                        {isCollapsed ? "▼" : "▲"}
                      </span>
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="flex flex-col gap-3">
                      {newsList.map((news) => {
                        const fromNow = dayjs(news.createdAt).fromNow();
                        const isExpanded = expandedNews[news.id] ?? false;

                        return (
                          <div
                            key={news.id}
                            className="bg-red-50 border border-red-200 p-3 rounded-xl cursor-pointer hover:bg-red-100"
                            onClick={() => navigate(`/news/${news.id}`)}
                          >
                            <div className="flex flex-col">
                              <img
                                src={news.thumbnailUrl}
                                alt={news.title}
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <p
                                className={`mt-2 ${
                                  isExpanded ? "" : "line-clamp-2"
                                } text-base font-semibold text-gray-800`}
                              >
                                {news.title}
                              </p>
                              {news.title.length > 40 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedNews((prev) => ({
                                      ...prev,
                                      [news.id]: !isExpanded,
                                    }));
                                  }}
                                  className="text-blue-500 text-xs mt-1"
                                >
                                  {isExpanded ? "간략히" : "더보기"}
                                </button>
                              )}
                              <p className="text-[11px] text-gray-400 mt-2">
                                {fromNow}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        <div ref={ref} className="h-1" />
      </div>
    </div>
  );
};

export default UrgentNewsListPage;
