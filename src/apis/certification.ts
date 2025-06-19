import { axiosInstance } from "./axios";
import { CommonResponse } from "../types/common";
import {
  CertificationListResponse,
  CertificationDetailResponse,
} from "../types/certification";

// 전체 목록
export const getCertifications = async () => {
  const res = await axiosInstance.get<CommonResponse<CertificationListResponse>>(
    "/api/certifications"
  );
  return res.data.result;
};

// 하나 하나 조회
export const getCertificationById = async (sequence: number) => {
  const res = await axiosInstance.get<CommonResponse<CertificationDetailResponse>>(
    `/api/certifications/${sequence}`
  );
  return res.data.result;
};
