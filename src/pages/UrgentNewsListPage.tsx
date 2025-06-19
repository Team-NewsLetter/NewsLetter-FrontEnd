import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { getCardNewsList } from "../apis/cardnews";
import { CardNews } from "../types/cardnews";
import { useNavigate } from "react-router-dom";

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
                  <div className="h-32 bg-gray-200 rounded-lg mb-2" />
                  <p className="font-medium text-gray-700">{news.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(news.createdAt).toLocaleDateString()} ·{" "}
                    {news.newsTag ?? "기타"}
                  </p>
                </div>
              ) : (
                <div
                  key={news.id}
                  onClick={() => navigate(`/news/${news.id}`)}
                  className="border border-blue-200 flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2 text-gray-700">
                      {news.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {news.newsTag ?? "기타"} · {(index + 1) * 10}분 전
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gray-200 rounded-md shrink-0" />
                </div>
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

export default UrgentNewsListPage;
