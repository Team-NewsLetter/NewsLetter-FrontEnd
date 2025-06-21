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

  if (!cardNewsId || isNaN(parsedId)) {
    return <div className="text-red-500 p-4">잘못된 접근입니다.</div>;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cardNewsDetail", parsedId],
    queryFn: () => getCardNewsDetail(Number(parsedId)),
    enabled: !isNaN(parsedId),
  });

  if (isLoading) return <div className="text-white p-4">로딩 중...</div>;
  if (isError || !data)
    return <div className="text-red-500 p-4">불러오기 실패</div>;

  const detail = data;

  // 카드 데이터 만들기
  const cuts: CutProps[] = detail.cardNewsItems.map((item: any) => ({
    type: "cut",
    src: `${item.imageUrl}`,
    text: item.description,
    cardNewsId: parsedId,
  }));

  const newsType = detail.newsType;
  // 마지막 피드백 슬라이드
  if (newsType === "실천") {
    cuts.push({
      type: "feedback",
      src: cuts[cuts.length - 1]?.src ?? "",
      text: newsType === "실천" ? "탄소 중립 참여에 기여하시겠습니까?" : "",
      cardNewsId: parsedId,
      newsType,
    });
  } else {
    cuts.push({
      type: "feedback",
      src: cuts[cuts.length - 1]?.src ?? "",
      text: "",
      cardNewsId: parsedId,
      newsType,
    });
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#a6b3f0] z-50">
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={1}
        spaceBetween={30}
      >
        {cuts.map((cut, index) => (
          <SwiperSlide key={index}>
            <Cut {...cut} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CuttoonViewer;
