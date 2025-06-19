// apis/home.ts
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./axios";
import { CommonResponse } from "../types/common";

export type HomeResult = {
  userId: number;
  nickname: string;
  backgroundImageUrl: string;
  level: number;
  newsReadingCount: number;
  practiceCount: number;
  experienceCount: number;
  speechBubble: string;
  characterImageUrl: string;
};

export type HomeResponse = CommonResponse<HomeResult>;

export const useHome = () => {
  return useQuery<HomeResponse>({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/home");
      return res.data;
    },
  });
};
