import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { getCardNewsList } from "../apis/cardnews";
import { CardNews } from "../types/cardnews";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const DailyNewsListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"popular" | "personal">("popular");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  dayjs.extend(relativeTime);

  enum UserTag {
    animal = "동물",
    plant = "식물",
    food = "음식",
    policy = "정책",
    science = "과학",
    life = "생활",
  }

  const getKoreanTagName = (tag: keyof typeof UserTag): string => {
    return UserTag[tag];
  };

  // 사용자 선호 태그 불러오기
  const { data: userTagsData } = useQuery({
    queryKey: ["userTags"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/tags");
      return res.data.result.tags; // ["animal", "plant", ...]
    },
    enabled: activeTab === "personal",
  });

  const { data, fetchNextPage, hasNextPage, isPending, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["cardNews", activeTab, selectedTag],
      queryFn: ({ pageParam = 0 }) =>
        getCardNewsList({
          page: pageParam,
          size: 10,
          type: "daily",
          tag: activeTab === "personal" ? selectedTag ?? undefined : undefined,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage.number;
        return lastPage.last ? undefined : currentPage + 1;
      },
      enabled:
        activeTab === "popular" || (activeTab === "personal" && !!selectedTag),
    });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isPending) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isPending, isFetchingNextPage]);

  const allNews: CardNews[] = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className="pt-7">
      {/* 탭 선택 */}
      <div className="flex justify-start mt-4 border-b border-gray-200 text-sm font-medium">
        <button
          onClick={() => setActiveTab("popular")}
          className={`w-1/2 py-2 ${
            activeTab === "popular" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          인기
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`w-1/2 py-2 ${
            activeTab === "personal" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          개인
        </button>
      </div>

      {/* 개인 탭: 태그 버튼 */}
      {activeTab === "personal" && userTagsData && (
        <div className="flex flex-wrap gap-2 px-4 mt-3">
          {userTagsData.map((tag: keyof typeof UserTag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === tag
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              #{getKoreanTagName(tag)}
            </button>
          ))}
        </div>
      )}

      {/* 리스트 */}
      <div className="flex flex-col gap-3 px-4 mt-4">
        {isPending ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse h-24 rounded-lg shadow-sm"
            />
          ))
        ) : allNews.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            뉴스가 없습니다.
          </div>
        ) : (
          allNews.map((news, index) =>
            index === 0 ? (
              <div
                key={news.id}
                onClick={() => navigate(`/news/${news.id}`)}
                className="border border-blue-200 rounded-lg p-3"
              >
                <img
                  src={news.thumbnailUrl}
                  alt={news.title}
                  className="object-cover rounded-md h-32 w-full"
                />
                <p className="font-medium text-gray-700 mt-2">{news.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {dayjs(news.createdAt).fromNow()}
                </p>
              </div>
            ) : (
              <div
                key={news.id}
                onClick={() => navigate(`/news/${news.id}`)}
                className="border border-blue-200 flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <img
                  src={news.thumbnailUrl}
                  alt={news.title}
                  className="object-cover rounded-md w-14 h-14"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2 text-gray-700">
                    {news.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dayjs(news.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            )
          )
        )}
        {isFetchingNextPage &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`next-loading-${i}`}
              className="h-20 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
      </div>

      <div ref={ref} className="h-1" />
    </div>
  );
};

export default DailyNewsListPage;
