import { axiosInstance } from "./axios";

export const getMyPage = async () => {
  const { data } = await axiosInstance.get("/api/users/mypage");
  return data.result;
};