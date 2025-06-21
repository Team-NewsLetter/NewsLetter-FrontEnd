import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { getCardNewsList } from "../apis/cardnews";
import { CardNews } from "../types/cardnews";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const UrgentNewsListPage = () => {
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

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

  return (
    <div className="pt-15 pb-20">
      <h1 className="px-4 text-blue-600 font-semibold text-lg mt-4 mb-2">
        긴급 뉴스
      </h1>

      <div className="flex flex-col gap-3 px-4 mt-4">
        {isPending
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-gray-200 animate-pulse h-24 rounded-lg"
              />
            ))
          : allNews.map((news, index) =>
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
            )}
      </div>

      <div ref={ref} className="h-1" />
    </div>
  );
};

export default UrgentNewsListPage;
