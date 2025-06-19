import { CommonResponse } from "../types/common.ts";
import { axiosInstance } from "./axios.ts";
import { CardNewsListResponseDto,SliceCardNewsListItemDto,CardNewsDetailResponseDto } from "../types/cardnews.ts";

export interface CardNewsListParams {
  page: number;
  size: number;
  type?: string; 
  tag?: string;
}

export const getCardNewsList = async (
  params: CardNewsListParams
): Promise<SliceCardNewsListItemDto> => {
  const { data } = await axiosInstance.get<CommonResponse<CardNewsListResponseDto>>(
    "/api/card-news",
    { params }
  );
  return data.result.cardNews; 
};

export const getCardNewsDetail = async (
  cardNewsId: number
): Promise<CardNewsDetailResponseDto> => {
  const { data } = await axiosInstance.get<CommonResponse<CardNewsDetailResponseDto>>(
    `/api/card-news/${cardNewsId}/detail`
  );
  return data.result;
};

