import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCardNewsList } from "../apis/cardnews";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../apis/axios";
import { CardNews } from "../types/cardnews";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import heartChar from "../images/heart.png";

dayjs.extend(relativeTime);

const DailyNewsListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"popular" | "personal">("popular");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);

  enum UserTag {
    animal = "동물",
    plant = "식물",
    food = "식품",
    policy = "정책",
    science = "과학",
    life = "생활",
  }

  const getKoreanTagName = (tag: keyof typeof UserTag): string => UserTag[tag];

  const { data: userTagsData } = useQuery({
    queryKey: ["userTags"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/tags");
      return res.data.result.tags;
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
      getNextPageParam: (lastPage) =>
        lastPage.last ? undefined : lastPage.number + 1,
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
  const top5News = allNews.slice(0, 5);

  return (
    <div className="pt-15 pb-28 overflow-x-hidden relative">
      <div className="px-4 flex items-center justify-between mb-6">
        <h1 className="text-blue-500 font-bold text-xl">일상 뉴스</h1>
      </div>

      {/* 탭 선택 */}
      <div className="flex justify-start mt-4 px-4 border-b border-gray-200 text-sm font-medium">
        <button
          onClick={() => {
            setActiveTab("popular");
            setShowList(false);
          }}
          className={`w-1/2 py-2 ${
            activeTab === "popular" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          인기
        </button>
        <button
          onClick={() => {
            setActiveTab("personal");
            setShowList(false);
          }}
          className={`w-1/2 py-2 ${
            activeTab === "personal" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          개인
        </button>
      </div>

      {/* 개인 탭 탐색 */}
      {activeTab === "personal" && userTagsData && (
        <div className="flex flex-wrap gap-2 px-4 mt-3">
          {userTagsData.map((tag: keyof typeof UserTag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setShowList(false);
              }}
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

      {/* 말풍선 */}
      {!showList && (
        <div className="fixed bottom-[220px] left-1/2 -translate-x-1/2 z-20">
          <div className="relative bg-white px-4 py-2 rounded-full border shadow text-sm text-gray-800 whitespace-nowrap">
            더 보고 싶으시다면 저를 눌러주세요!
          </div>
        </div>
      )}

      {/* 캐릭터 */}
      {!showList && (
        <img
          src={heartChar}
          alt="귀여워요"
          className="w-32 h-32 fixed bottom-15 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer"
          onClick={() => setShowList(true)}
        />
      )}

      {/* Swiper */}
      <div className="mt-6 flex flex-col items-center justify-center relative">
        <h2 className="text-base font-semibold text-gray-700 mb-2">
          요즘 핫한 Top 5 🔥
        </h2>
        <div className="w-[300px] max-w-full">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            centeredSlides={true}
            loop
            className="rounded-xl !pb-8"
          >
            {top5News.map((news) => (
              <SwiperSlide key={news.id}>
                <div
                  onClick={() => navigate(`/news/${news.id}`)}
                  className="bg-white rounded-2xl shadow p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition"
                >
                  <img
                    src={news.thumbnailUrl}
                    alt={news.title}
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-gray-800 font-semibold text-sm line-clamp-2">
                    {news.title}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* 뉴스 리스트 */}
      {showList && (
        <div className="flex flex-col gap-4 px-6 mt-6">
          {isPending ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-gray-200 animate-pulse h-24 rounded-lg"
              />
            ))
          ) : allNews.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              뉴스가 없습니다.
            </div>
          ) : (
            allNews.map((news) => {
              const fromNow = dayjs(news.createdAt).fromNow();
              return (
                <div
                  key={news.id}
                  className="border p-3 rounded-xl cursor-pointer hover:bg-blue-50 transition border-gray-200"
                  onClick={() => navigate(`/news/${news.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={news.thumbnailUrl}
                      alt={news.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 line-clamp-2">
                        {news.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {news.newsTag || "기타"} · {fromNow}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`loading-${i}`}
                className="bg-gray-100 animate-pulse h-20 rounded-lg"
              />
            ))}
          <div ref={ref} className="h-1" />
        </div>
      )}
    </div>
  );
};

export default DailyNewsListPage;
