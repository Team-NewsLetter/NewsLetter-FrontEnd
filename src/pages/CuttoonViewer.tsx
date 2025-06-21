import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { Cut, CutProps } from "../components/Cut";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardNewsDetail } from "../apis/cardnews";

const CuttoonViewer = () => {
  const { cardNewsId } = useParams();
  const parsedId = Number(cardNewsId);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cardNewsId || isNaN(parsedId)) {
    return <div className="text-red-500 p-4">잘못된 접근입니다.</div>;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cardNewsDetail", parsedId],
    queryFn: () => getCardNewsDetail(parsedId),
    enabled: !isNaN(parsedId),
  });

  if (isLoading) return <div className="text-white p-4">로딩 중...</div>;
  if (isError || !data)
    return <div className="text-red-500 p-4">불러오기 실패</div>;

  const detail = data;
  const domain = "http://51.20.65.235:8080";

  const cuts: CutProps[] = detail.cardNewsItems
    .slice(0, -1)
    .map((item: any) => ({
      type: "cut",
      src: `${item.imageUrl}`,
      text: item.description,
      cardNewsId: parsedId,
    }));

  const last = detail.cardNewsItems[detail.cardNewsItems.length - 1];
  const feedbackCut: CutProps = {
    type: "feedback",
    src: `${domain}${last?.imageUrl ?? ""}`,
    text:
      detail.newsType === "실천" ? "탄소 중립 참여에\n기여하시겠습니까?" : "",
    cardNewsId: parsedId,
    newsType: detail.newsType,
  };

  cuts.push(feedbackCut);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-pink-200 via-blue-100 to-indigo-200 z-50">
      {/* 상단 페이지 표시 */}
      <div className="absolute top-4 w-full text-center text-white text-sm font-semibold z-10">
        {currentIndex + 1} / {cuts.length}
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={1}
        spaceBetween={30}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        className="h-full w-full"
      >
        {cuts.map((cut, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center items-center h-full px-4 whitespace-pre-line break-normal	">
              <Cut {...cut} index={index} total={cuts.length} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CuttoonViewer;
