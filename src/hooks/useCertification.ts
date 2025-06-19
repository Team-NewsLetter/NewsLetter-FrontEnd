import { useQuery } from "@tanstack/react-query";
import {
  getCertifications,
  getCertificationById,
} from "../apis/certification";

// 목록
export const useCertifications = () =>
  useQuery({
    queryKey: ["certifications"],
    queryFn: getCertifications,
  });

// 하나씩
export const useCertificationDetail = (sequence: number) =>
  useQuery({
    queryKey: ["certification", sequence],
    queryFn: () => getCertificationById(sequence),
    enabled: !!sequence,
  });
